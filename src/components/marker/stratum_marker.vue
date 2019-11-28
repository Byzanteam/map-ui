<template>
  <div class="stratum-marker">
    <marker-point
      v-for="(marker, index) in markers"
      :key="`${marker.location[0]}${marker.location[1]}${index}`"
      :marker-style="getMarkerStyle(marker)"
      :inner-label-style="getInnerLabelStyle(marker)"
      :icon="getIcon(marker)"
      :marker="marker"
      @marker-rendered="markerRenderedFunc"
      @marker-clicked="markerClickedFunc"
      @marker-dbclicked="markerDbclickedFunc"
      @marker-mouseover="markerMouseoverFunc"
      @marker-mouseout="markerMouseoutFunc"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import MarkerPoint from './index';
import MapMixin from '../../mixins/map';

const DEFAULT_STYLE_MAP = null;

const DEFAULT_MAERKER_POINT_STYLE = {
  color: '#04BF78',
  size: 24,
  strokeColor: 'rgba(255, 255, 255, 0.2)',
  strokeWidth: 1,
};

export const StratumMarker =  {
  components: {
    MarkerPoint,
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

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };
    },
  },

  methods: {
    markerRenderedFunc (marker) {
      this.counter += 1;
      if (marker) {
        const new_position = marker.getPosition();
        const hasMarker = _.find(this.markerRefs, (item) => {
          const old_position = item.getPosition();
          return old_position.lng === new_position.lng
        && old_position.lat === new_position.lat;
        });
        if (!hasMarker) {
          this.markerRefs.push(marker);
        }
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
        return this.markerPointStyle;
      }

      const currentStyle = _.findLast(
        _.sortBy(this.markerStyleMap, 'value'),
        ({ value }) => marker.value >= value
      );

      if (currentStyle) {
        return {
          ...this.markerStyle,
          ...currentStyle,
        };
      }
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
      _.forEach(this.markerRefs, (marker) => {
        this.map.remove(marker);
      });
      this.counter = 0;
      this.markerRefs = [];
    },

    markerClickedFunc (marker) {
      this.$emit('marker-clicked', marker);
    },

    markerDbclickedFunc (marker) {
      this.$emit('marker-dbclicked', marker);
    },

    markerMouseoverFunc (marker) {
      this.$emit('marker-mouseover', marker);
    },

    markerMouseoutFunc (marker) {
      this.$emit('marker-mouseout', marker);
    },
  },
};

export default StratumMarker;
</script>
