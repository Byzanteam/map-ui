<template>
  <div class="markers-wrapper">
    <marke-with-popup
      v-for="(marker, index) in markerOptions.data"
      :key="index"
      :marker="marker"
      :markerStyle="markerOptions.style"
      :events="markerOptions.events">
    </marke-with-popup>
  </div>
</template>

<script>
import MarkerWithPopup from './marker_with_popup.vue';

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
}
</script>
