<template>
  <div>

  </div>
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";

export default {
  name: "VCluster",
  components: {
    MglGeojsonLayer
  },
  props: {
    map: {
      type: Object,
      default: null
    },
    clusterOptions: {
      type: Object,
      default: null
    },
  },
  created () {
    this.addSource();
  },
  methods: {
    addSource () {
      this.map.addSource(this.clusterOptions.name, {
        type: "geojson",
        cluster: true,
        data: this.clusterOptions.data,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })
    },
  }
}
</script>
<style>

</style>
