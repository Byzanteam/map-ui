<script>
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
    iconType: {
      type: String,
      default: 'circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
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
      this.markerRefs = this.markers.map((itme) => {
        const marker = new AMap.Marker({
          map: this.map,
          position: itme.lnglat,
          content: this.getMarkerContent(),
          anchor: 'bottom-center',
          extData: itme,
          offset: new AMap.Pixel(0, 0),
        });

        return marker;
      });
    },

    getMarkerContent () {
      const {
        color,
        size,
      } = this.markerPointStyle;

      const node = `<div style="width: ${size}px;height: ${size}px;font-size: 0px;">
        <svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" height="100%">
          <path
            fill="${color}"
            d="${ICONS[this.iconType].paths}"
          />
        </svg>
      </div>`;

      return node;
    },
  },
};

export default MarkerPoint;
</script>
