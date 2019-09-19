<template>
  <base-marker
    ref="markerRef"
    @markerReady="markerReadyFunc"
    @marker-clicked="markerClickedFunc"
    @marker-mouseover="markerMouseoverFunc"
    @marker-mouseout="markerMouseoutFunc"
  />
</template>

<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';
import BaseMarker from './base_marker';

const DEFAULT_STYLE_MAP = null;

export default {
  components: {
    BaseMarker,
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
     * 如果设置了映射，小于最小映射的返回undefined
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
        const { innerLabelStyle = {} } = currentStyle;
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
</script>
