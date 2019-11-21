<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <mass-marker
      :markers="pointData"
    />
  </base-map>
</template>

<script>
import MassMarker from '../../src/components/marker/mass_marker';
import BaseMap from '../../src/components/map.vue';

import cities from './cities';

export default {
  components: {
    MassMarker,
    BaseMap,
  },

  data () {
    return {
      pointData: cities,
    };
  },

  mounted () {
    this.pointData = cities;
  },

  methods: {
    markerClickedFunc () {
      this.pointData = [];
    },
  },
};
</script>
