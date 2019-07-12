<script>
import _ from 'lodash';
import markers from './markers.json';

const DEFAULT_MAERKER = {
  radius: 20,
  strokeColor: '#767676',
  strokeWidth: 1,
  fill: '#4e6398',
};

const POINT_TYPES = [
  'circle',
  'triangle',
  'triangle-down',
  'hexagon',
  'water-droplet',
  'pentagram',
];

const LABEL_STYLE = {
  fontSize: '12px',
  color: '#fff',
  fontWeight: 400,
};

export const MapPoint = {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'circle',
      validator: value => POINT_TYPES.includes(value),
    },
    cluster: {
      type: Boolean,
      default: true,
    },
    descriptionKey: {
      type: String,
      default: 'description',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    valueOption: {
      type: Array,
      default: () => [],
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    labelStyle: {
      type: Object,
      default: () => {},
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
      return {
        ...DEFAULT_MAERKER,
        ...this.markerStyle,
      };
    },

    labelResult () {
      return {
        ...LABEL_STYLE,
        ...this.labelStyle,
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
      if (this.cluster) {
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

    clusterMarker () {

    },

    getStringWidth (text, fontSize = 16, fontFamily = 'sans-serif') {
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      ctx.font = `${fontSize}px ${fontFamily}`;
      const { width } = ctx.measureText(text);
      return width;
    },

    generateMakers () {
      this.generateMarkers = this.data.map((itme) => {
        const marker = new AMap.Marker({
          position: itme.lnglat,
          content: this.getGraphics(itme),
          anchor: 'bottom-center',
          extData: itme,
          offset: new AMap.Pixel(0, 0),
        });

        return marker;
      });
    },

    buildMakers (map) {
      _.forEach(this.generateMarkers, value => value.setMap(map));
    },

    getLabel (itme, userDiameter) {
      if (!itme[this.labelKey]) return '';

      const { color, fontWeight, fontSize } = this.labelResult;
      const label = itme[this.labelKey];
      const fontWidth = this.getStringWidth(label, 12);
      const fontOffset = -(fontWidth - userDiameter) / 2;

      const node = `<div
          style="
            position: absolute;
            width:${fontWidth}px;
            height:100%;
            left:${fontOffset}px;
            line-height:${userDiameter}px;
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

    getGraphics (itme) {
      const { icons: [{ icons }], size: [size] } = markers;
      const {
        radius,
        fill,
        strokeWidth,
        strokeColor,
      } = {
        ...this.markerResult,
        ...this.levelOptionParse(itme, this.valueKey, this.valueOption),
      };

      const [path] = icons[this.type].paths;
      // 实际 icon 加上边框大小
      const viewDiameter = size + strokeWidth * 2;
      // 用户设置的 icon 大小
      const userDiameter = radius * 2;

      const node = `<div style="width:${userDiameter}px;height:${userDiameter}px">
        ${this.getLabel(itme, userDiameter, strokeWidth)}
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
            d='${path}'>
        </svg>
      </div>`;

      return node;
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
