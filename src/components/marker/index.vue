<script>
import _ from 'lodash';

import MapMixin from '../../mixins/map';
import Icons from './icons.json';

const { icons: [{ icons: ICONS }], size: [SIZE] } = Icons;

const DEFAULT_MAERKER_POINT_STYLE = {
  color: '#04BF78',
  size: 6,
};

const DEFAULT_ICON_TYPES = [
  'circle',
  'triangle',
  'triangle-down',
  'hexagon',
  'water-droplet',
  'pentagram',
];

const DEFAULT_STYLE_MAP = null;

const DEFAULT_BORDER = {
  color: 'rgba(255, 255, 255, 0.2)',
  width: 1,
};

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
};

const INNER_LABERL_FIXED_STYLE = `
  position: absolute;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
  width:auto;
  white-space:nowrap;
`;

export const MarkerPoint = {
  name: 'MarkerPoint',

  mixins: [MapMixin],

  props: {
    markers: {
      type: Array,
      default: () => [],
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: 'circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    markerStyleMap: {
      type: Array,
      default: () => DEFAULT_STYLE_MAP,
    },
    borderStyle: {
      type: Object,
      default: () => ({}),
    },
    innerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      markerRefs: [],
    };
  },

  watch: {
    markers (current) {
      if (this.map) {
        this.setMarkerData(current);
      }
    },
  },

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };
    },
    markerBorderStyle () {
      return {
        ...DEFAULT_BORDER,
        ...this.borderStyle,
      };
    },
    markerInnerLabelStyle () {
      return {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...this.innerLabelStyle,
      };
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderMarkers(this.markers);
    },

    renderMarkers (data) {
      if (!data.length) return;

      this.markerRefs = data.map((item) => {
        const marker = new AMap.Marker({
          map: this.map,
          position: item.location,
          content: this.getMarkerContent(item),
          anchor: 'bottom-center',
          extData: item,
          offset: new AMap.Pixel(0, 0),
        });

        marker.on('click', e => this.$emit('markerClick', e));
        marker.on('mouseover', e => this.$emit('markerMouseover', e));
        marker.on('mouseout', e => this.$emit('markerMouseout', e));

        return marker;
      });
    },

    getMarkerContent (marker) {
      const {
        color,
        size,
      } = this.getMarkerStyle(marker);

      let markerSize = size;
      let label = '';

      const {
        color: borderColor,
        width,
      } = this.markerBorderStyle;

      if (color !== 'transparent' && marker.label) {
        const { size: fontSizePadding } = DEFAULT_MAERKER_POINT_STYLE;
        const { fontSize } = this.markerInnerLabelStyle;
        label = this.getInnerLabel(marker);
        markerSize = fontSize + (fontSizePadding * 2);
      }

      const node = `<div
        style="width: ${markerSize}px;height: ${markerSize}px;font-size: 0px;position: relative;">
        ${label}
        <svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" height="100%">
          <path
            stroke-width="${width}px"
            stroke="${borderColor}"
            fill="${color}"
            d="${ICONS[this.icon].paths}"
          />
        </svg>
      </div>`;

      return node;
    },

    getInnerLabel (marker) {
      const {
        fontSize,
        color,
        fontWeight,
      } = this.markerInnerLabelStyle;

      const userSettingStyle = `
        font-weight: ${fontWeight};
        color: ${color};
        font-size:${fontSize}px;
      `;

      return `<div
        style="${INNER_LABERL_FIXED_STYLE}${userSettingStyle}"
      >
        ${marker.label}
      </div>`;
    },

    /**
     * 如果设置了映射，小于最小映射的透明色
     */
    getMarkerStyle (marker) {
      if (!this.markerStyleMap || !_.isNumber(marker.value)) {
        return this.markerPointStyle;
      }

      const currentStyle = _.findLast(
        _.sortBy(this.markerStyleMap, 'value'),
        ({ value }) => marker.value >= value
      );

      return {
        ...{
          color: 'transparent',
          size: this.markerPointStyle.size,
        },
        ...currentStyle,
      };
    },

    setMarkerData (data) {
      this.clear();
      this.renderMarkers(data);
    },

    clear () {
      _.forEach(this.markerRefs, marker => this.map.remove(marker));
      this.markerRefs = [];
    },
  },
};

export default MarkerPoint;
</script>
