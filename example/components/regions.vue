<template>
  <base-map
    :map-options="{viewMode: '3D', zoom: 4}"
    :transparent="true"
  >
    <regions :custom-area="true" />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Regions from '../../src/components/regions.vue';

export default {
  components: {
    BaseMap,
    Regions,
  },
};
</script>

<style lang="scss">
  // move to reset, then let style be scoped
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
  }
</style>
