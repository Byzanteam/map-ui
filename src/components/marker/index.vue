<template>
  <basic-marker
    ref="markerRef"
    :point="marker"
    :icon="icon"
    :inner-label-style="innerLabelStyle"
    :marker-style="markerPointStyle"
    @markerCreated="markerCreatedFunc"
    @markerClick="markerClickFunc"
    @markerMouseover="markerMouseoverFunc"
    @markerMouseout="markerMouseoutFunc"
  />
</template>

<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';
import BasicMarker from './marker';


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
    marker: {
      type: Object,
      default: () => ({}),
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

  computed: {
    markerPointStyle () {
      return {
        ...this.markerStyle,
        ...this.getMarkerStyle(),
      };
    },
  },

  methods: {
    markerCreatedFunc (marker) {
      this.$emit('markerCreated', marker);
    },

    /**
     * 如果设置了映射，小于最小映射的透明色
     */
    getMarkerStyle () {
      if (!this.markerStyleMap || !_.isNumber(this.marker.value)) {
        return this.markerStyle;
      }

      const currentStyle = _.findLast(
        _.sortBy(this.markerStyleMap, 'value'),
        ({ value }) => this.marker.value >= value
      );

      return {
        color: 'transparent',
        ...currentStyle,
      };
    },
    clear () {
      this.$refs.markerRef.clear();
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
