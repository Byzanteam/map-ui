<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <marker-point
      :markers="pointData"
      :marker-style-maps="markerStyleMaps"
      icon-type="water-droplet"
    />
  </base-map>
</template>
<script>
import MarkerPoint from '../../src/components/marker_point/marker_point.vue';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    MarkerPoint,
    BaseMap,
  },

  data () {
    return {
      pointData: [
        { lnglat: [116.258446, 37.686622], value: 1 },
        { lnglat: [113.559954, 22.124049], value: 2 },
        { lnglat: [116.366794, 39.915309], value: 2 },
        { lnglat: [116.486409, 39.921489], value: 2 },
        { lnglat: [116.286968, 39.863642], value: 0 },
      ],
      markerStyleMaps: [
        { value: 1, color: 'yellow' },
        { value: 2, color: 'red' },
        { value: 2, color: 'green' },
      ],
    };
  },
};
</script>
