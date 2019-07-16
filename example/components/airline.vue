<template>
  <base-map
    :map-options="{ zoom: 4 }"
  >
    <air-line
      :points="points"
      :edges="edges"
      :out-points="[points[0]]"
    />
  </base-map>
</template>

<script>
import { BaseMap } from '../../src/components/map.vue';
import { AirLine } from '../../src/components/airline.vue';

export default {
  components: {
    BaseMap,
    AirLine,
  },

  data () {
    return {
      points: [
        {
          id: 4,
          name: '成都',
          lng: 104.06,
          lat: 30.67,
        },
        {
          id: 1,
          name: '北京',
          lng: 116.46,
          lat: 39.92,
        },
        {
          id: 2,
          name: '上海',
          lng: 121.48,
          lat: 31.22,
        },
      ],

      edges: [
        {
          source: 1,
          target: 2,
          value: 100,
        },
        {
          source: 1,
          target: 4,
          value: 56,
        },
        {
          source: 4,
          target: 1,
          value: 700,
        },
        {
          source: 4,
          target: 2,
          value: 654,
        },
        {
          source: 2,
          target: 1,
          value: 120,
        },
        {
          source: 2,
          target: 4,
          value: 72,
        },
      ],
    };
  },
};
</script>
