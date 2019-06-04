<template>
  <div id="app">
    <base-map />
  </div>
</template>

<script>
import BaseMap from "./components/base_map.vue"

export default {
  name: "app",
  components: {
    "base-map": BaseMap
  }
};
</script>

<style>
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
