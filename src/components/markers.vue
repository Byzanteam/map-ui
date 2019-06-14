<template>
  <div class="markers-wrapper">
    <MarkerWithPopup
      v-for="(marker, index) in markerOptions.data"
      :key="index"
      :marker="marker"
      :markerStyle="markerOptions.style"
      :events="markerOptions.events">
    </MarkerWithPopup>
  </div>
</template>

<script>
import MarkerWithPopup from "./marker_with_popup.vue";

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
