<template>
  <div class="container">
    <base-map
      :map-options="{
        zoom: 4
      }"
      use-map-ui
    >
      <marker-point
        v-for="(marker, index) in markers"
        :key="index"
        :marker="marker"
        @marker-click=""
      />
      <info-window
        ref="windowRef"
        :options="{closeWhenClickMap: true}"
        :location="infoData.location"
        :info-window-html="infoData.content"
      />
    </base-map>
    <button
      class="open-btn"
      @mouseover="createWindow({
        location: [116.258446, 37.686622],
        content: '<div>123</div>'
      })"
    >
      打开信息框1
    </button>
    <button
      class="open-btn"
      @mouseover="createWindow({
        location: [116.858446, 38.686622],
        content: '<div>456</div>'
      })"
    >
      打开信息框2
    </button>
  </div>
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
        { location: [116.258446, 37.686622] },
        { location: [113.559954, 22.124049] },
      ],
      infoData: {
        location: [0, 0],
        content: '<div></div>',
      },
    };
  },

  methods: {
    createWindow (info) {
      this.infoData = info;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}

.open-btn {
  position: absolute;
  bottom: 20px;

  &:nth-child(1) {
    left: 20px;
  }

  &:nth-child(2) {
    left: 120px;
  }
}
</style>
