<template>
  <base-map
    :map-options="{
      zoom: 5
    }"
    use-map-ui
  >
    <simple-marker
      :markers="pointData"
      :label-style="labelStyle"
      :marker-style="markerStyle"
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
    img: 'http://img.sccnn.com/bimg/337/35663.jpg',
    icon: 'hexagon',
  },
  {
    id: 2,
    location: [113.559954, 23.124049],
    value: 1.5,
    label: [
      {
        style: {
          color: '#4196ff',
          fontSize: 14,
        },
        text: '二号点',
      },
      {
        style: {
          color: '#ff8441',
          fontSize: 12,
        },
        text: '描述',
      },
    ],
    img: 'http://photocdn.sohu.com/20130925/Img387224863.jpg',
    icon: 'star',
  },
  {
    id: 3,
    location: [116.366794, 40.915309],
    value: 2,
    label: '三号点',
    img: 'http://static01.lvye.com/portal/201604/28/093110pb7151d134r1rvet.jpg',
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
        icon: 'triangle-down',
        size: 80,
      },
      labelStyle: {
        padding: 10,
        color: 'purple',
        fontSize: 13,
        fontweight: 500,
      },
    };
  },
};
</script>
