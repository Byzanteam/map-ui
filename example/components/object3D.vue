<template>
  <base-map
    :map-options="{
      viewMode: '3D',
      pitch: 30,
      rotation: 25,
      zoom: 18,
      center: [104.069755, 30.61565],
      showIndoorMap: false
    }"
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
      modelPath: 'test/fengde',
      lightOption: {
        ambientLight: [[1, 1, 1], 1],
        directionLight: [[1, 0, -0.5], [1, 1, 1], 0.5],
      },
      modelOption: {
        position: [104.069755, 30.61565],
        scale: 3,
        height: 3,
        scene: 0,
      },
    };
  },
};
</script>
