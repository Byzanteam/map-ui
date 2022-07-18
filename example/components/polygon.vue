<template>
  <base-map
    :map-options="{
      viewMode: '3D',
      pitch: 60,
      zoom: 14,
      center: [104.049835, 30.566256],
      resizeEnable: true,
      showIndoorMap: false,
      showBuildingBlock:false,
    }"
    map-style="amap://styles/b71b42b9bcd91bf21d3dee1ed11ceee5"
    :use-map-ui="true"
  >
    <custom-polygon
      ref="polygon"
      :path="path"
      :poly-style="polyStyle"
    />
    <button
      style="position: absolute; top: 200px; left: 200px; z-index: 99999"
      @click="$refs.polygon.open()"
    >
      开始编辑
    </button>
  </base-map>
</template>

<script>
import CustomPolygon from '../../src/components/custom-polygon';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    BaseMap,
    'custom-polygon': CustomPolygon,
  },

  data () {
    return {
      path: [
        [104.069606, 30.532093],
        [104.069606, 30.609024],
        [104.079606, 30.609824],
      ],
      polyStyle: {
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 1,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
      },
    };
  },
};
</script>

<style>
.marker-point {
  position: relative;
  width: 62px;
  height: 6px;
  /*transform: rotate(270deg);*/
  background-image: url("../../public/test/markpoint.png");
  /*background: aquamarine;*/
  background-size: 100% 100%;
}
</style>
