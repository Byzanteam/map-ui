<template>
  <base-map
    :map-options="{
      zoom: 5
    }"
    use-map-ui
  >
    <simple-marker
      :markers="pointData"
      :marker-label-style="markerLabelStyle"
      :marker-style="markerStyle"
      :marker-style-map="markerStyleMap"
      icon="waterDrop"
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
    img: 'http://img.sccnn.com/bimg/337/35663.jpg',
  },
  {
    id: 2,
    location: [113.559954, 23.124049],
    value: 1.5,
    labelStyles: [
      {
        color: '#4196ff',
        fontSize: 14,
      },
      {
        color: '#ff8441',
        fontSize: 12,
      },
    ],
    label: ['二号点', '描述'],
    img: 'http://photocdn.sohu.com/20130925/Img387224863.jpg',
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
  {
    id: 6,
    location: [116.286968, 39.863642],
    value: 20,
    label: ['六号点特别长', '描述也很长', '这排用默认字体样式'],
    img: 'http://static01.lvye.com/portal/201604/28/093110pb7151d134r1rvet.jpg',
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
      markerLabelStyle: {
        padding: 10,
        color: 'purple',
        fontSize: 13,
        fontweight: 500,
      },
      markerStyleMap: [
        {
          value: 1,
          icon: 'star',
          labelStyles: [
            {
              color: 'blue',
              fontSize: 15,
            },
            {
              color: 'red',
              fontSize: 17,
            },
          ],
        },
        {
          value: 4,
          icon: 'triangleDown',
          labelStyles: [
            {
              color: 'blue',
              fontSize: 20,
            },
            {
              color: 'red',
              fontSize: 30,
            },
          ],
        },
        {
          value: 10,
          icon: 'triangleDown',
          size: 80,
          labelStyles: [
            {
              color: '#b70019',
              fontSize: 50,
              fontweight: 900,
            },
            {
              color: '#9e0693',
              fontSize: 90,
              fontweight: 900,
            },
          ],
        },
      ],
    };
  },
};
</script>
