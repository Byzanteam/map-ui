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
    styleMapKey: {
      type: String,
      default: 'value',
    },
  },

  data () {
    return {
      markerRefs: [],
    };
  },

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderMarkers();
    },

    renderMarkers () {
      this.markerRefs = this.markers.map((item) => {
        const marker = new AMap.Marker({
          map: this.map,
          position: item.lnglat,
          content: this.getMarkerContent(item),
          anchor: 'bottom-center',
          extData: item,
          offset: new AMap.Pixel(0, 0),
        });

        return marker;
      });
    },

    getMarkerContent (marker) {
      const {
        color,
        size,
      } = this.getCurrentMarkerStyle(
        marker,
        this.markerPointStyle,
        this.markerStyleMap
      );

      const node = `<div style="width: ${size}px;height: ${size}px;font-size: 0px;">
        <svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" height="100%">
          <path
            fill="${color}"
            d="${ICONS[this.icon].paths}"
          />
        </svg>
      </div>`;

      return node;
    },

    /**
     * 如果设置了映射，小于最小映射的透明色
     */
    getCurrentMarkerStyle (marker, defaultStyle, styleMaps) {
      const markerValue = marker[this.styleMapKey];
      let currentStyle = {};

      if (!styleMaps && !_.isNumber(markerValue)) return defaultStyle;

      styleMaps.sort((a, b) => a.value - b.value);

      _.forEach(styleMaps, ({ value, ...rest }) => {
        if (markerValue >= value) {
          currentStyle = rest;
        }
      });

      return {
        ...{
          color: 'transparent',
          size: defaultStyle.size,
        },
        ...currentStyle,
      };
    },
  },
};

export default MarkerPoint;
</script>
