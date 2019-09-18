<template>
  <basic-marker
    ref="markerRef"
    :icon="icon"
    :inner-label-style="innerLabelStyle"
    @markerReady="markerReadyFunc"
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
      uuid: _.uniqueId(),
    };
  },

  watch: {
    markers () {
      this.clear();
    },
    markerStyleMap () {
      this.clear();
    },
    innerLabelStyle () {
      this.clear();
    },
    icon () {
      this.clear();
    },
  },

  methods: {
    markerReadyFunc () {
      _.forEach(this.markers, (marker) => {
        this.$refs.markerRef.renderMarker(marker, this.getMarkerStyle(marker));
      });
      this.$parent.$emit('markersRendered', {
        source: this.uuid,
        payload: this.markerRefs,
      });
    },
    markerCreatedFunc (marker) {
      this.markerRefs.push(marker);
    },

    clear () {
      if (this.map) {
        _.forEach(this.markerRefs, (marker) => {
          this.map.remove(marker);
        });
      }
      this.markerRefs = [];
    },

    /**
     * 如果设置了映射，小于最小映射的透明色
     */
    getMarkerStyle (marker) {
      if (!this.markerStyleMap || !_.isNumber(marker.value)) {
        return this.markerStyle;
      }

      const currentStyle = _.findLast(
        _.sortBy(this.markerStyleMap, 'value'),
        ({ value }) => marker.value >= value
      );

      return {
        color: 'transparent',
        ...currentStyle,
      };
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
