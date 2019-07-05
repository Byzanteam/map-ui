<template>
  <base-map>
    <test />
    <regions />
  </base-map>
</template>

<script>
import BaseMap from '../src/components/map.vue';
import test from '../src/components/test.vue';
import Regions from '../src/components/regions.vue';

export default {
  components: {
    BaseMap,
    test,
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
