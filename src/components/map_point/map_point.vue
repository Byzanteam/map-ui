<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';
import markers from './markers.json';

const DEFAULT_MAERKER = {
  radius: 20,
  strokeColor: '#767676',
  strokeWeight: 2,
  fillColor: '#4e6398',
};

export const MapPoint = {
  mixins: [MapMixin],

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
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
      type: String,
      default: 'value',
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    labelOption: {
      type: Array,
      default: () => [],
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
      if (this.cluster) {
        this.buildClusterMakers(this.map);
      } else {
        this.buildMakers(this.map);
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

    clusterMarker (context) {

    },

    generateMakers () {
      this.generateMarkers = this.data.map((itme) => {
        const marker = new AMap.Marker({
          position: itme.lnglat,
          content: this.getGraphics(),
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

    getGraphics () {
      const { icons: [{ icons }], size: [size] } = markers;
      const {
        radius,
        fillColor,
        strokeWeight,
        strokeColor,
      } = this.markerResult;

      const [path] = icons[this.type].paths;

      // 实际 icon 加上边框大小
      const viewDiameter = size + strokeWeight * 2;
      // 用户设置的 icon 大小
      const userDiameter = radius * 2;

      const node = `<svg
          viewBox="0 0 ${viewDiameter} ${viewDiameter}"
          width="${userDiameter}px"
          height="${userDiameter}px"
        >
        <path
          stroke-width="${strokeWeight}"
          stroke="${strokeColor}"
          fill="${fillColor}"
          transform="translate(${strokeWeight} ${strokeWeight})"
          d='${path}'>
      </svg>`;

      return node;
    },
  },
};

export default MapPoint;
</script>
