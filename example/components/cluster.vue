<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <cluster
      :markers="pointData"
      :marker-style-map="markerStyleMap"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Cluster from '../../src/components/cluster';

const MARKERS = [
  {
    id: 1,
    location: [116.258446, 37.686622],
    value: 0,
    label: '一号点',
  },
  {
    id: 2,
    location: [113.559954, 22.124049],
    value: 1.5,
  },
  {
    id: 3,
    location: [116.366794, 39.915309],
    value: 2,
    label: '三号点',
  },
  {
    id: 4,
    location: [116.486409, 39.921489],
    value: 2,
    label: '四号点',
  },
  {
    id: 5,
    location: [116.286968, 39.863642],
    value: 5,
    label: '五号点',
  },
];

export default {
  components: {
    BaseMap,
    Cluster,
  },

  data () {
    return {
      pointData: [],
      markerStyleMap: [
        { value: 1, color: 'green' },
        { value: 2, color: 'red' },
      ],
    };
  },

  mounted () {
    this.pointData = MARKERS;
  },
};
</script>
