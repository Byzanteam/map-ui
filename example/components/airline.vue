<template>
  <base-map
    :features="['bg', 'road']"
    :map-options="{ zoom: 5 }"
    use-map-ui
  >
    <air-line
      :edges="edges"
      :points="points"
    />
  </base-map>
</template>

<script>
import _ from 'lodash';
import { BaseMap } from '../../src/components/map.vue';
import { AirLine } from '../../src/components/airline.vue';

const POSITIONS = [
  [111.670801, 40.818311, '内蒙古自治区'],
  [113.665412, 34.757975, '河南省'],
  [87.617733, 43.792818, '新疆维吾尔自治区'],
  [123.429096, 41.796767, '辽宁省'],
  [114.298572, 30.584355, '湖北省'],
  [113.280637, 23.125178, '广东省'],
  [126.642464, 45.756967, '黑龙江省'],
  [118.767413, 32.041544, '江苏省'],
  [108.948024, 34.263161, '陕西省'],
  [117.000923, 36.675807, '山东省'],
  [91.132212, 29.660361, '西藏自治区'],
  [119.306239, 26.075302, '福建省'],
  [117.283042, 31.86119, '安徽省'],
  [106.713478, 26.578343, '贵州省'],
  [106.504962, 29.533155, '重庆市'],
  [121.472644, 31.231706, '上海市'],
  [112.982279, 28.19409, '湖南省'],
  [110.33119, 20.031971, '海南省'],
  [108.320004, 22.82402, '广西壮族自治区'],
  [121.509062, 25.044332, '台湾省'],
  [114.502461, 38.045474, '河北省'],
  [101.778916, 36.623178, '青海省'],
  [114.173355, 22.320048, '香港特别行政区'],
  [120.153576, 30.287459, '浙江省'],
  [115.892151, 28.676493, '江西省'],
  [103.823557, 36.058039, '甘肃省'],
  [113.54909, 22.198951, '澳门特别行政区'],
  [106.278179, 38.46637, '宁夏回族自治区'],
  [104.065735, 30.659462, '四川省'],
  [125.3245, 43.886841, '吉林省'],
  [102.712251, 25.040609, '云南省'],
  [112.549248, 37.857014, '山西省'],
  [116.405285, 39.904989, '北京市'],
  [117.190182, 39.125596, '天津市'],
];
const POINTS = _.map(POSITIONS, (position) => {
  const [lng, lat, id] = position;
  return {
    id,
    position: [lng, lat],
  };
});

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
        value: Math.ceil(Math.random() * 100),
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
    const points = _.sampleSize(POINTS, 15);
    return {
      points,
      edges: GenerateEdges(points, 30),
    };
  },
};
</script>
