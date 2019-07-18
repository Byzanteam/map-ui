<template>
  <base-map
    :map-options="{ zoom: 5 }"
    use-map-ui
  >
    <air-line
      :points="points"
      :edges="edges"
      :out-points="outPoints"
      :in-points="inPoints"
      @point-clicked="pointClicked"
    />
  </base-map>
</template>

<script>
import _ from 'lodash';
import { BaseMap } from '../../src/components/map.vue';
import { AirLine } from '../../src/components/airline.vue';

const POSITIONS = [
  [111.670801, 40.818311],
  [113.665412, 34.757975],
  [87.617733, 43.792818],
  [123.429096, 41.796767],
  [114.298572, 30.584355],
  [113.280637, 23.125178],
  [126.642464, 45.756967],
  [118.767413, 32.041544],
  [108.948024, 34.263161],
  [117.000923, 36.675807],
  [91.132212, 29.660361],
  [119.306239, 26.075302],
  [117.283042, 31.86119],
  [106.713478, 26.578343],
  [106.504962, 29.533155],
  [121.472644, 31.231706],
  [112.982279, 28.19409],
  [110.33119, 20.031971],
  [108.320004, 22.82402],
  [121.509062, 25.044332],
  [114.502461, 38.045474],
  [101.778916, 36.623178],
  [114.173355, 22.320048],
  [120.153576, 30.287459],
  [115.892151, 28.676493],
  [103.823557, 36.058039],
  [113.54909, 22.198951],
  [106.278179, 38.46637],
  [104.065735, 30.659462],
  [125.3245, 43.886841],
  [102.712251, 25.040609],
  [112.549248, 37.857014],
  [116.405285, 39.904989],
  [117.190182, 39.125596],
];
const POINTS = _.map(POSITIONS, (position, id) => ({
  id,
  position,
}));

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
      edges: GenerateEdges(POINTS, 500),
      inPoints: _.sampleSize(POINTS, 1),
    };
  },

  methods: {
    pointClicked (point) {
      this.outPoints = [point];
    },
  },
};
</script>
