<template>
  <base-map>
    <map-point
      description-key="name"
      :data="pointData"
    />
  </base-map>
</template>

<script>
import BaseMap from '../src/components/map.vue';
import MapPoint from '../src/components/map_point.vue';

export default {
  components: {
    BaseMap,
    MapPoint,
  },

  data () {
    return {
      pointData: [
        { lnglat: [116.258446, 37.686622], name: '景县' },
        { lnglat: [113.559954, 22.124049], name: '圣方济各堂区' },
        { lnglat: [116.366794, 39.915309], name: '西城区' },
        { lnglat: [116.486409, 39.921489], name: '朝阳区' },
        { lnglat: [116.286968, 39.863642], name: '丰台区' },
      ],
    };
  },
};
</script>

<style lang="scss">
  // move to reset, then let style be scoped
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
  }
</style>
