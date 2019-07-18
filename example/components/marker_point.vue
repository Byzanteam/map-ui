<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <marker-point
      :markers="pointData"
    />
  </base-map>
</template>
<script>
import MarkerPoint from '../../src/components/marker_point.vue';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    MarkerPoint,
    BaseMap,
  },

  data () {
    return {
      pointData: [
        { lnglat: [116.258446, 37.686622], description: '景县' },
        { lnglat: [113.559954, 22.124049], description: '圣方济各堂区' },
        { lnglat: [116.366794, 39.915309], description: '西城区' },
        { lnglat: [116.486409, 39.921489], description: '朝阳区' },
        { lnglat: [116.286968, 39.863642], description: '丰台区' },
      ],
    };
  },
};
</script>
