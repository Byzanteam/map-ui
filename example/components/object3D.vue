<template>
  <base-map
    :map-options="{
      viewMode: '3D',
      pitch: 30,
      rotation: 0,
      zoom: 13,
      center: [104.049835, 30.566256],
      showIndoorMap: false,
      showBuildingBlock:false,
      skyColor: '#5A75C6'
    }"
    map-style="amap://styles/47544281fde20c50707a56083af07455"
    :use-map-ui="true"
  >
    <object3-d
      :model-source-path="modelPath"
      :light-option="lightOption"
      :model-option="modelOption"
      @modelClick="modelClick"
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
      modelPath: ['test/test7.gltf'],
      lightOption: {
        ambientLight: [[1, 1, 1], 1],
        directionLight: [[0, -1, 1], [1, 1, 1], 1],
      },
      modelOption: {
        position: [104.04969, 30.566186],
        scale: 7.75,
        height: 10,
        scene: 0,
      },
    };
  },

  methods: {
    modelClick (index, object, point, distance) {
      console.log(index, object, point, distance);
    },
  },
};
</script>
