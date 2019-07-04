<template>
  <base-map />
</template>

<script>
import BaseMap from '../src/components/map.vue';

export default {
  components: {
    BaseMap,
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
