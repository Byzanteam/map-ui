<template>
  <div>
    <MglMarker
      v-for="(marker, index) in markers"
      :key="index"
      :coordinates="marker.geometry.coordinates">
      <v-icon slot="marker"></v-icon>
      <MglPopup :closeButton="false">
        <div>{{ marker.properties.message }}</div>
      </MglPopup>
    </MglMarker>
  </div>
</template>

<script>
import { MglMarker, MglPopup } from "vue-mapbox";
import Vicon from "./icon.vue"
export default {
  components: {
    MglMarker,
    MglPopup
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
