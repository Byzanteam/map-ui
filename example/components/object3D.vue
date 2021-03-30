<template>
  <base-map
    :map-options="{
      viewMode: '3D',
      pitch: 30,
      rotation: 65,
      zoom: 16,
      center: [104.068251, 30.587363],
      showIndoorMap: false,
      showBuildingBlock:false,
    }"
    map-style="amap://styles/4af33ebc995aa04f3685f273e774e85f"
    :use-map-ui="true"
  >
    <object3-d
      :model-source-path="modelPath"
      :light-option="lightOption"
      :model-option="modelOption"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Object3D from '../../src/components/object3D';

export default {
  components: {
    BaseMap,
    Object3D,
  },

  data () {
    return {
      modelPath: ['test/3Dtest'],
      lightOption: {
        ambientLight: [[1, 1, 1], 1],
        directionLight: [[1, 0, -0.5], [1, 1, 1], 0.5],
      },
      modelOption: {
        position: [104.068251, 30.587363],
        scale: 8,
        height: 8,
        scene: 0,
      },
    };
  },
};
</script>
