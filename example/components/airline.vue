<template>
  <base-map
    :map-options="{ zoom: 4 }"
  >
    <air-line
      ref="airlineRef"
      :points="points"
      :edges="edges"
      :out-points="outPoints"
      @point-clicked="pointClicked"
    />
  </base-map>
</template>

<script>
import _ from 'lodash';
import { BaseMap } from '../../src/components/map.vue';
import { AirLine } from '../../src/components/airline.vue';

const POINTS = [
  {
    id: 3,
    position: [104.06, 30.67],
  },
  {
    id: 4,
    position: [87.68, 43.77],
  },
  {
    id: 1,
    position: [116.46, 39.92],
  },
  {
    id: 2,
    position: [121.48, 31.22],
  },
  {
    id: 5,
    position: [91.11, 29.97],
  },
  {
    id: 6,
    position: [101.74, 36.56],
  },
  {
    id: 7,
    position: [111.65, 40.82],
  },
  {
    id: 8,
    position: [113.23, 23.16],
  },
  {
    id: 9,
    position: [126.63, 45.75],
  },
  {
    id: 10,
    position: [110.35, 20.02],
  },
];

function GenerateEdges (points, count) {
  const cache = [],
        result = [],
        maxCount = (points.length ** 2) - points.length;
  while (result.length < Math.min(count, maxCount)) {
    const [source, target] = _.sampleSize(points, 2);
    if (!(_.includes(cache, `${source.id},${target.id}`))) {
      cache.push(`${source.id},${target.id}`);
      result.push({
        source: source.id,
        target: target.id,
      });
    }
  }
  return result;
}

export default {
  components: {
    BaseMap,
    AirLine,
  },

  data () {
    return {
      points: POINTS,
      outPoints: _.sampleSize(POINTS, 1),
      edges: GenerateEdges(POINTS, 70),
    };
  },

  methods: {
    pointClicked (point) {
      this.outPoints = [point];
    },
  },
};
</script>
