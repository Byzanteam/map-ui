<template>
  <base-map>
    <test />
  </base-map>
</template>

<script>
import BaseMap from '../src/components/map.vue';
import test from '../src/components/test.vue';

export default {
  components: {
    BaseMap,
    test,
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
