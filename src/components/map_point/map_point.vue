<script>
import _ from 'lodash';
import Point from '../../mixins/point';
import MapMixin from '../../mixins/map';

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
  mixins: [MapMixin, Point],

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
      this.initMakers(this.instance.map);
    },

    initMakers (map) {
      this.generateMakers();
      this.buildMakers(map);
    },

    generateMakers () {
      const { markerLv, valueKey } = this.levelOptionResult;

      this.generateMarkers = this.data.map((extData) => {
        const content = this.getGraphics(
          extData[this.labelKey],
          this.styleResults(
            extData,
            markerLv,
            this.markerResult,
            valueKey,
          ),
        );

        const center = this.markerResult.pointStyle.radius;

        const marker = new AMap.Marker({
          position: extData.lnglat,
          anchor: 'bottom-center',
          extData,
          offset: new AMap.Pixel(center, center),
          content,
        });

        marker.on('click', e => this.$emit('pointClick', e));

        return marker;
      });
    },

    buildMakers (map) {
      _.forEach(
        this.generateMarkers,
        value => value.setMap(map)
      );
    },
  },

  render () {
    return null;
  },
};

export default MapPoint;
</script>
