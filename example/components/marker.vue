<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <marker-point
      :markers="pointData"
      :marker-style-map="markerStyleMap"
      icon="water-droplet"
      inner-label-show
    />
  </base-map>
</template>
<script>
import MarkerPoint from '../../src/components/marker';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    MarkerPoint,
    BaseMap,
  },

  data () {
    return {
      pointData: [
        { id: 1, location: [116.258446, 37.686622], value: 0 },
        { id: 2, location: [113.559954, 22.124049], value: 1.5 },
        { id: 3, location: [116.366794, 39.915309], value: 2 },
        { id: 4, location: [116.486409, 39.921489], value: 2 },
        { id: 5, location: [116.286968, 39.863642], value: 5 },
      ],
      markerStyleMap: [
        { value: 1, color: 'green' },
        { value: 2, color: 'red' },
      ],
    };
  },
};
</script>
