<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';
import markers from './markers.json';

const DEFAULT_MAERKER = {
  radius: 20,
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

export const MapPoint = {
  mixins: [MapMixin],

  props: {
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    valueOption: {
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
      const {
        marker = {},
        label = {},
        icon = '',
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

    levelOptionResult () {
      const {
        marker = [],
        valueKey = 'value',
      } = this.valueOption;
      return {
        markerLv: _.sortedUniqBy([
          ...DEFAULT_MAERKER_VALUE,
          ...marker,
        ], obj => obj.value),
        valueKey,
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
