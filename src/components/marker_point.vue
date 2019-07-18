<script>
import MapMixin from '../mixins/map';

const DEFAULT_MAERKER_POINT_STYLE = {
  radius: 20,
  strokeColor: '#767676',
  strokeWeight: 2,
  fillColor: '#4e6398',
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
      this.buildMakers(this.map);
    },

    renderMarkers () {
      this.markerRefs = this.markers.map((itme) => {
        const marker = new AMap.Marker({
          map: this.map,
          position: itme.lnglat,
          content: this.markerContent(),
          anchor: 'bottom-center',
          extData: itme,
          offset: new AMap.Pixel(0, 0),
        });

        return marker;
      });
    },

    markerContent () {
      const {
        fillColor,
        radius,
        strokeWeight,
        strokeColor,
      } = this.markerPointStyle;

      return `<div style="
            background-color: ${fillColor};
            height: ${radius}px;
            width: ${radius}px;
            border: ${strokeWeight}px solid ${strokeColor};
            border-radius: ${radius}px;"></div>`;
    },
  },
};

export default MarkerPoint;
</script>
