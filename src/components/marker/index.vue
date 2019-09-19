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

const DEFAULT_STYLE_MAP = null;


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
    icon: {
      type: String,
      default: 'Circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    markerStyleMap: {
      type: Array,
      default: () => DEFAULT_STYLE_MAP,
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

  watch: {
    markers (current) {
      this.setMarkerData(current);
    },
    markerStyleMap () {
      this.setMarkerData(this.markers);
    },
    innerLabelStyle () {
      this.setMarkerData(this.markers);
    },
    icon () {
      this.setMarkerData(this.markers);
    },
  },

  methods: {
    markerReadyFunc () {
      this.renderMarkers(this.markers);
    },

    renderMarkers (data) {
      if (!data.length) return;
      this.markerRefs = _.map(data, (item) => {
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
          ...this.markerStyle,
          innerLabelStyle: this.innerLabelStyle,
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
          ...this.markerStyle,
          ...currentStyle,
          innerLabelStyle: {
            ...this.innerLabelStyle,
            ...innerLabelStyle,
          },
        };
      }
    },
    clear () {
      _.forEach(this.markerRefs, (marker) => {
        if (marker) {
          this.map.remove(marker);
        }
      });
      this.markerRefs = [];
    },
    setMarkerData (data) {
      if (this.map) {
        this.clear();
        this.renderMarkers(data);
      }
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
