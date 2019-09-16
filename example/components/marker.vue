<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    use-map-ui
  >
    <marker-point
      :markers="pointData"
      :marker-style-map="markerStyleMap"
      icon="WaterDrop"
      @markerClick="markerClickFunc"
    />
  </base-map>
</template>
<script>
import MarkerPoint from '../../src/components/marker';
import BaseMap from '../../src/components/map.vue';

const MARKERS = [
  {
    id: 1,
    location: [116.258446, 37.686622],
    value: 0,
    labelStyles: [
      {
        color: 'blue',
        fontSize: 14,
      },
      {
        color: 'red',
        fontSize: 12,
      },
    ],
    label: ['一号点', '描述'],
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
    MarkerPoint,
    BaseMap,
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

  methods: {
    markerClickFunc () {
      this.pointData = [];
    },
  },
};
</script>
