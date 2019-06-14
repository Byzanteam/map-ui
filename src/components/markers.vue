<template>
  <div class="markers-wrapper">
    <MarkerWithPopup
      v-for="(marker, index) in markers"
      :key="index"
      :marker="marker"
      :markerOptions="markerOptions">
    </MarkerWithPopup>
  </div>
</template>

<script>
import MarkerWithPopup from "./marker_with_popup.vue"

export default {
  components: {
    MarkerWithPopup,
  },
  props: {
    markerOptions: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      markers: this.markerOptions.data,
    }
  },
}
</script>

<style>

</style>
