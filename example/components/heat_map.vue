<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <heat-map
      :heat-points="heatPoints"
      :heat-point-radius="heatPointRadius"
      :heat-point-color-mapping="heatPointColorMapping"
    />
  </base-map>
</template>
<script>
import HeatMap from '../../src/components/heat_map.vue';
import BaseMap from '../../src/components/map.vue';

const DATA_TEST = [
  {
    id: 1,
    location: [116.389275, 39.925818],
    val: 10,
  },
  {
    id: 2,
    location: [116.191031, 39.988585],
    val: 11,
  },
  {
    id: 3,
    location: [116.287444, 39.810742],
    val: 12,
  },
  {
    id: 4,
    location: [116.481707, 39.940089],
    val: 13,
  },
];

export default {
  components: {
    HeatMap,
    BaseMap,
  },

  data () {
    return {
      heatPoints: [],
      heatPointRadius: 50,
      heatPointColorMapping: {
        0.5: 'red',
        1: 'green',
      },
    };
  },

  mounted () {
    this.heatPoints = DATA_TEST.map((currentValue) => {
      const {
        id,
        location: [lng, lat],
        val: count,
      } = currentValue;
      return {
        id,
        lng,
        lat,
        count,
      };
    });
  },
};
</script>
