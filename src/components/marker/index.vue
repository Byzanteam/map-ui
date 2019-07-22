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
  color: '#ffffff33',
  width: 1,
};

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
    markerBorderStyle () {
      return {
        ...DEFAULT_BORDER,
        ...this.borderStyle,
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
          position: item.location,
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
      } = this.getMarkerStyle(marker);

      const {
        color: borderColor,
        width,
      } = this.markerBorderStyle;

      const node = `<div style="width: ${size}px;height: ${size}px;font-size: 0px;">
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
  },
};

export default MarkerPoint;
</script>
