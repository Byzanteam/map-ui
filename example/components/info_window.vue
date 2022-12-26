<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    :map-js-api-version="'1.4.15'"
    :map-ui-version="'1.0.11'"
    :map-key="'589b5c001b469482903a085837155e99'"
    use-map-ui
  >
    <marker-point
      v-for="(marker, index) in markers"
      :key="index"
      :marker="marker"
      :marker-style="markerStyle"
      @marker-clicked="createWindow(marker)"
    />
    <info-window
      ref="windowRef"
      :info-window-options="{closeWhenClickMap: true}"
      :location="infoData.location"
      :info-window-html="infoData.content"
    />
  </base-map>
</template>

<script>
import MarkerPoint from '../../src/components/marker/index';
import BaseMap from '../../src/components/map.vue';
import infoWindow from '../../src/components/info_window.vue';

export default {
  components: {
    BaseMap,
    MarkerPoint,
    infoWindow,
  },

  data () {
    return {
      markers: [
        { location: [116.258446, 37.686622], label: '一号点', content: '<div>123</div>' },
        { location: [113.559954, 22.124049], label: '二号点', content: '<div>456</div>' },
      ],
      markerStyle: {
        color: 'transparent',
        strokeColor: 'red',
        size: 30,
      },
      infoData: {},
    };
  },

  created () {
    this.infoData = this.markers;
  },

  methods: {
    createWindow (info) {
      this.infoData = info;
      this.$refs.windowRef.open();
    },
  },
};
</script>
