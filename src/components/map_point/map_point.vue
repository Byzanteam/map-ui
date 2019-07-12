<script>
import _ from 'lodash';
import markers from './markers.json';

const { icons: [{ icons: ICONS }], size: [SIZE] } = markers;

const DEFAULT_MAERKER = {
  radius: 20,
  strokeColor: '#767676',
  strokeWidth: 1,
  fill: '#4e6398',
};

const DEFAULT_CLUSTER = {
  radius: 30,
  strokeColor: '#767676',
  strokeWidth: 1,
  fill: '#4e6398',
};

const DEFAULT_MAERKER_LABEL = {
  fontSize: '12px',
  color: '#888',
  fontWeight: 400,
};

const DEFAULT_MAERKER_VALUE = [
  { value: 3, style: { fill: '#E28E49' } },
  { value: 2, style: { fill: '#EAC438' } },
  { value: 1, style: { fill: '#A6B76F' } },
];

const DEFAULT_CLUSTER_VALUE = [
  { value: 3, style: { fill: '#E28E49' } },
  { value: 2, style: { fill: '#EAC438' } },
  { value: 1, style: { fill: '#A6B76F' } },
];

const POINT_TYPES = [
  'circle',
  'triangle',
  'triangle-down',
  'hexagon',
  'water-droplet',
  'pentagram',
];

const DEFAULT_ICON = 'circle';

export const MapPoint = {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    noCluster: {
      type: Boolean,
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    clusterStyle: {
      type: Object,
      default: () => ({}),
    },
    valueOption: {
      type: Object,
      default: () => ({}),
    },
    labelKey: {
      type: String,
      default: 'label',
    },
  },

  inject: ['instance'],

  data () {
    return {
      generateMarkers: [],
    };
  },

  computed: {
    map () {
      return this.instance.map;
    },

    markerResult () {
      const {
        marker = {},
        label = {},
        icon = DEFAULT_ICON,
      } = this.markerStyle;

      return {
        pointStyle: {
          ...DEFAULT_MAERKER,
          ...marker,
        },
        labelStyle: {
          ...DEFAULT_MAERKER_LABEL,
          ...label,
        },
        icon,
      };
    },

    clusterResult () {
      const {
        cluster = {},
        label = {},
        icon = DEFAULT_ICON,
      } = this.clusterStyle;

      return {
        pointStyle: {
          ...DEFAULT_CLUSTER,
          ...cluster,
        },
        labelStyle: {
          ...DEFAULT_MAERKER_LABEL,
          ...label,
        },
        icon,
      };
    },

    levelOptionResult () {
      const {
        marker = [],
        cluster = [],
        valueKey = 'value',
      } = this.valueOption;
      return {
        markerLv: _.sortedUniqBy([
          ...DEFAULT_MAERKER_VALUE,
          ...marker,
        ], obj => obj.value),
        clusterLv: _.sortedUniqBy([
          ...DEFAULT_CLUSTER_VALUE,
          ...cluster,
        ], obj => obj.value),
        valueKey,
      };
    },
  },

  watch: {
    map (current) {
      this.initMakers(current);
    },
  },

  methods: {
    initMakers (map) {
      this.generateMakers();
      if (!this.noCluster) {
        this.buildClusterMakers(map);
      } else {
        this.buildMakers(map);
      }
    },

    buildClusterMakers (map) {
      map.plugin(
        ['AMap.MarkerClusterer'],
        () => new AMap.MarkerClusterer(
          map,
          this.generateMarkers,
          { renderClusterMarker: this.clusterMarker },
        )
      );
    },

    clusterMarker ({ count, marker }) {
      const { clusterLv } = this.levelOptionResult;

      marker.setContent(
        this.getGraphics(
          count,
          this.styleResults(
            { value: count },
            clusterLv,
            this.clusterResult,
          ),
        )
      );
    },

    getStringWidth (text, fontSize = 16, fontFamily = 'sans-serif') {
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      ctx.font = `${fontSize}px ${fontFamily}`;
      const { width } = ctx.measureText(text);
      return width;
    },

    generateMakers () {
      const { markerLv, valueKey } = this.levelOptionResult;

      this.generateMarkers = this.data.map((extData) => {
        const content = this.getGraphics(
          extData[this.labelKey],
          this.styleResults(
            extData,
            markerLv,
            this.markerResult,
            valueKey,
          )
        );

        const center = this.markerResult.pointStyle.radius;

        const marker = new AMap.Marker({
          position: extData.lnglat,
          anchor: 'bottom-center',
          extData,
          offset: new AMap.Pixel(center, center),
          content,
        });

        marker.on('click', (e) => this.$emit('pointClick',e));

        return marker;
      });
    },

    buildMakers (map) {
      _.forEach(
        this.generateMarkers,
        value => value.setMap(map)
      );
    },

    getLabel (label = '', diameter = 0, style = {}) {
      if (!label) return '';

      const { color, fontWeight, fontSize } = style;
      const fontWidth = this.getStringWidth(label, 12);
      const fontOffset = -(fontWidth - diameter) / 2;

      const node = `<div
          style="
            position: absolute;
            width:${fontWidth}px;
            height:100%;
            left:${fontOffset}px;
            line-height:${diameter}px;
            color:${color};
            font-weight:${fontWeight};
            font-size:${fontSize};
            opacity: 0.8;
          "
        >
          ${label}
        </div>`;
      return node;
    },

    getGraphics (labelText, style) {
      const {
        point: {
          radius,
          fill,
          strokeWidth,
          strokeColor,
        },
        labelStyle,
        icon,
      } = style;

      let iconType = DEFAULT_ICON;

      // 实际 icon 加上边框大小
      const viewDiameter = SIZE + strokeWidth * 2;
      // 用户设置的 icon 大小
      const userDiameter = radius * 2;

      if (POINT_TYPES.includes(icon)) iconType = icon;

      const node = `<div style="width:${userDiameter}px;height:${userDiameter}px">
        ${this.getLabel(labelText, userDiameter, labelStyle)}
        <svg
            viewBox="0 0 ${viewDiameter} ${viewDiameter}"
            width="100%"
            height="100%"
          >
          <path
            stroke-width="${strokeWidth}"
            stroke="${strokeColor}"
            fill="${fill}"
            transform="translate(${strokeWidth} ${strokeWidth})"
            d='${ICONS[iconType].paths}'>
        </svg>
      </div>`;

      return node;
    },

    styleResults (point, levelOption, style, vkey = 'value') {
      const { pointStyle, labelStyle, icon } = style;

      return {
        point: {
          ...pointStyle,
          ...this.levelOptionParse(point, vkey, levelOption),
        },
        labelStyle,
        icon,
      };
    },

    levelOptionParse (content, key, option) {
      const pointValue = content[key];
      let matchStyle = {};

      if (!_.isNumber(pointValue)) return {};
      option.sort((a, b) => a.value - b.value);

      _.forEach(option, ({ value, style }) => {
        if (pointValue >= value) {
          matchStyle = style;
        }
      });

      return matchStyle;
    },
  },

  render () {
    return null;
  },
};

export default MapPoint;
</script>
