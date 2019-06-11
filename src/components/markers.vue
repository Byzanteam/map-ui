<template>
  <div>
    <MglMarker
      v-for="(marker, index) in markers"
      :key="index"
      :coordinates="marker.geometry.coordinates"
      color="blue">
      <!-- <div slot="marker">mdi-map-marker</div> -->
    </MglMarker>
  </div>
</template>

<script>
import { MglMarker } from "vue-mapbox";
export default {
  components: {
    MglMarker
  },
  props: {
    map: {
      type: Object,
      default () {
        return {};
      },
    },
    markerOptions: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      markers: this.markerOptions.data
    }
  }
}
</script>

<style>

</style>
