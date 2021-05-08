<template>
  <base-map
    :map-options="{
      zoom: 14,
      center: [104.049835, 30.566256],
    }"
  >
    <path-replay
      ref="path"
      :path="path"
      :marker="marker"
      :content="markerContent"
      :options="{
        anchor: 'bottom-center'
      }"
    />
  </base-map>
</template>

<script>
// import CustomMarker from '../../src/components/marker/custom_marker';
import PathReplay from '../../src/components/pathReplay';
import BaseMap from '../../src/components/map.vue';
import markerPoint from "../../public/test/markpoint.png";

export default {
  components: {
    BaseMap,
    // CustomMarker,
    PathReplay,
  },

  data () {
    return {
      path: [[104.069606, 30.532093], [104.069606, 30.609024]],
      innerLabelStyle: {
        color: 'red',
        fontSize: 10,
        padding: ['10px', 0],
        offset: [0, 0],
      },
      markerStyle: {
        backgroundColor: '',
      },
      marker: {
        id: 1,
        point: [104.069606, 30.532093],
        value: 0,
        label: '一号点',
      },
      markerContent: `
        <div
          class="marker-point"
        />
      `,
    };
  },

  created () {
    console.log(this.$refs.path);
  },
};
</script>

<style>
.marker-point {
  position: relative;
  width: 124px;
  height: 24px;
  transform: rotate(270deg);
  background-image: url("../../public/test/markpoint.png");
  background-size: 100% 100%;
}
</style>
