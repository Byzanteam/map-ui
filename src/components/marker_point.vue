<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const DEFAULT_MAERKER = {
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
      generateMarkers: [],
    };
  },

  computed: {
    markerResult () {
      return {
        ...DEFAULT_MAERKER,
        ...this.markerStyle,
      };
    },
  },

  methods: {
    mapLoadedFunc () {
      this.generateMakers();
      this.buildMakers(this.map);
    },

    generateMakers () {
      this.generateMarkers = this.markers.map((itme) => {
        const marker = new AMap.Marker({
          position: itme.lnglat,
          content: this.markerContent(),
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

    markerContent () {
      const {
        fillColor,
        radius,
        strokeWeight,
        strokeColor,
      } = this.markerResult;

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
