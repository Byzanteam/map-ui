<template>
  <div class="markers-wrapper">
    <marker-with-popup
      v-for="(marker, index) in markerOptions.data"
      :key="index"
      :marker="marker"
      :marker-style="markerOptions.style"
      :events="markerOptions.events"
    />
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
};
</script>
