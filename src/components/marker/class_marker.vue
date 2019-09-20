<template>
  <div class="marker-group">
    <marker-ponit
      v-for="marker in markers"
      ref="markerRef"
      :key="`${marker.location[0]}${marker.location[1]}`"
      :marker-style="getMarkerStyle(marker)"
      :inner-label-style="getInnerLabelStyle(marker)"
      :icon="getIcon(marker)"
      :marker="marker"
      @marker-rendered="markerRenderedFunc"
      @marker-clicked="markerClickedFunc"
      @marker-mouseover="markerMouseoverFunc"
      @marker-mouseout="markerMouseoutFunc"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import MarkerPonit from './index';

const DEFAULT_STYLE_MAP = null;

export const MarkerGroup =  {
  components: {
    MarkerPonit,
  },

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
      default: 'circle',
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
      counter: 0,
    };
  },

  watch: {
    markers () {
      this.clear();
    },
    markerStyle () {
      this.clear();
    },
    icon () {
      this.clear();
    },
    markerStyleMap () {
      this.clear();
    },
    innerLabelStyle () {
      this.clear();
    },
  },

  methods: {
    markerRenderedFunc (marker) {
      this.counter += 1;
      if (marker) {
        this.markerRefs.push(marker);
      }
      if (this.counter >= this.markers.length) {
        this.$parent.$emit('markersRendered', {
          source: this.uuid,
          payload: this.markerRefs,
        });
      }
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
        ...this.markerStyle,
        ...currentStyle,
      };
    },

    getInnerLabelStyle (marker) {
      const markerStyle = this.getMarkerStyle(marker) || {};
      const { innerLabelStyle = {} } = markerStyle;
      return {
        ...this.innerLabelStyle,
        ...innerLabelStyle,
      };
    },

    getIcon (marker) {
      const { icon } = this.getMarkerStyle(marker) || {};
      return icon || this.icon;
    },

    clear () {
      _.forEach(this.$refs.markerRef, (marker) => {
        marker.clear();
      });
      this.markerRefs = [];
      this.counter = 0;
    },

    markerClickedFunc (marker) {
      this.$emit('marker-clicked', marker);
    },

    markerMouseoverFunc (marker) {
      this.$emit('marker-mouseover', marker);
    },

    markerMouseoutFunc (marker) {
      this.$emit('marker-mouseout', marker);
    },
  },
};

export default MarkerGroup;
</script>
