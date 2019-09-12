<template>
  <base-map
    :map-options="{
      zoom: 5
    }"
    use-map-ui
  >
    <simple-marker
      :markers="pointData"
      :label-style="{
        color: 'red'
      }"
      icon="TriangleDown"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import SimpleMarker from '../../src/components/marker/simple_marker';

const MARKERS = [
  {
    id: 1,
    location: [116.258446, 38.686622],
    value: 0,
    label: [
      {
        style: {
          color: 'blue',
          fontSize: 14,
        },
        text: '一号点',
      },
      {
        style: {
          color: 'red',
          fontSize: 12,
        },
        text: '描述',
      },
    ],
    img: 'http://pic25.nipic.com/20121112/9252150_150552938000_2.jpg',
    icon: 'star',
  },
  {
    id: 2,
    location: [113.559954, 23.124049],
    value: 1.5,
  },
  {
    id: 3,
    location: [116.366794, 40.915309],
    value: 2,
    label: '三号点',
  },
  {
    id: 4,
    location: [116.886409, 39.921489],
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
    SimpleMarker,
  },

  data () {
    return {
      pointData: MARKERS,
      markerStyle: {
        shape: 'WaterDrop',
      },
    };
  },
};
</script>
