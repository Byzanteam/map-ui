<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <heat-map
      :heat-points="heatPoints"
    />
  </base-map>
</template>
<script>
import HeatMap from '../../src/components/heat_map.vue';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    HeatMap,
    BaseMap,
  },

  data () {
    return {
      heatPoints: [],
      data: [
        {
          id: 66535,
          info: '北京',
          location: [116.389275, 39.925818],
          val: 10,
        },
        {
          id: 31234,
          info: '北京',
          location: [116.191031, 39.988585],
          val: 11,
        },
        {
          id: 66535,
          info: '北京',
          location: [116.287444, 39.810742],
          val: 12,
        },
        {
          id: 31234,
          info: '北京',
          location: [116.481707, 39.940089],
          val: 13,
        },
      ],
    };
  },

  mounted () {
    this.heatPoints = this.data.map((currentValue) => {
      const {
        id,
        info,
        location: [lng, lat],
        val: count,
      } = currentValue;
      return {
        id,
        info,
        lng,
        lat,
        count,
      };
    });
  },
};
</script>
