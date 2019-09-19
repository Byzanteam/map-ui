<template>
  <basic-marker
    ref="markerRef"
    @markerReady="markerReadyFunc"
    @markerClick="markerClickFunc"
    @markerMouseover="markerMouseoverFunc"
    @markerMouseout="markerMouseoutFunc"
  />
</template>

<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';
import BasicMarker from './marker';

const DEFAULT_MAERKER_POINT_STYLE = {
  color: '#04BF78',
  size: 24,
  strokeColor: 'rgba(255, 255, 255, 0.2)',
  strokeWidth: 1,
};

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
  padding: [2, 4],
};


const DEFAULT_ICON_TYPES = [
  'Circle',
  'FivePointsStar',
  'WaterDrop',
  'Triangle',
  'TriangleDown',
  'Hexagon',
];

export default {
  components: {
    BasicMarker,
  },
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
    markerStyleMap: {
      type: Array,
      default: () => null,
    },
    icon: {
      type: String,
      default: 'Circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    innerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      markerRefs: [],
      uuid: _.uniqueId('marker_'),
    };
  },

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };
    },
    markerInnerLabelStyle () {
      return {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...this.innerLabelStyle,
      };
    },
  },

  watch: {
    markers () {
      this.setData();
    },
    markerStyleMap () {
      this.setData();
    },
    innerLabelStyle () {
      this.setData();
    },
    icon () {
      this.setData();
    },
  },

  methods: {
    markerReadyFunc () {
      this.renderMarkers();
    },

    renderMarkers () {
      this.markerRefs = _.map(this.markers, (item) => {
        const markerStyle = this.getMarkerStyle(item);
        if (!markerStyle) return;
        const marker = this.$refs.markerRef.renderMarker(item, markerStyle);
        return marker;
      });
      this.$parent.$emit('markersRendered', {
        source: this.uuid,
        payload: this.markerRefs,
      });
    },

    /**
     * 如果设置了映射，小于最小映射的透明色
     */
    getMarkerStyle (marker) {
      if (!this.markerStyleMap || !_.isNumber(marker.value)) {
        return {
          icon: this.icon,
          ...this.markerPointStyle,
          innerLabelStyle: this.markerInnerLabelStyle,
        };
      }

      const currentStyle = _.findLast(
        _.sortBy(this.markerStyleMap, 'value'),
        ({ value }) => marker.value >= value
      );

      if (currentStyle) {
        const { innerLabelStyle = [] } = currentStyle;
        return {
          icon: this.icon,
          ...this.markerPointStyle,
          ...currentStyle,
          innerLabelStyle: {
            ...this.markerInnerLabelStyle,
            ...innerLabelStyle,
          },
        };
      }
    },
    clear () {
      _.forEach(this.markerRefs, (marker) => {
        if (this.map && marker) {
          this.map.remove(marker);
        }
      });
      this.markerRefs = [];
    },
    setData () {
      this.clear();
      this.renderMarkers();
    },
    markerClickFunc (marker) {
      this.$emit('markerClick', marker);
    },
    markerMouseoverFunc (marker) {
      this.$emit('markerMouseover', marker);
    },
    markerMouseoutFunc (marker) {
      this.$emit('markerMouseout', marker);
    },
  },
};
</script>
