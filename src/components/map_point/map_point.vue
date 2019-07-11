<script>
import _ from 'lodash';
import markers from './markers.json';

const DEFAULT_MAERKER = {
  radius: 20,
  strokeColor: '#767676',
  strokeWidth: 2,
  fillColor: '#4e6398',
};


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

    // clusterMarker (context) {

    // },

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
        strokeWidth,
        strokeColor,
      } = this.markerResult;

      const [path] = icons[this.type].paths;

      // 实际 icon 加上边框大小
      const viewDiameter = size + strokeWidth * 2;
      // 用户设置的 icon 大小
      const userDiameter = radius * 2;

      const node = `<svg
          viewBox="0 0 ${viewDiameter} ${viewDiameter}"
          width="${userDiameter}px"
          height="${userDiameter}px"
        >
        <path
          stroke-width="${strokeWidth}"
          stroke="${strokeColor}"
          fill="${fillColor}"
          transform="translate(${strokeWeight} ${strokeWeight})"
          d='${path}'>
      </svg>`;

      return node;
    },
  },

  render () {
    return null;
  },
};

export default MapPoint;
</script>
