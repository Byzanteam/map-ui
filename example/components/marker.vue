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
      :inner-label-style="innerLabelStyle"
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
    innerLabelStyles: [
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
    innerLabelStyles: [
      {
        color: 'blue',
        fontSize: 14,
      },
      {
        color: 'red',
        fontSize: 12,
      },
    ],
    label: '四号点',
  },
  {
    id: 5,
    location: [116.286968, 39.883742],
    value: 3,
    label: ['五号点', '描述'],
  },
  {
    id: 5,
    location: [116.286968, 39.863642],
    value: 5,
    label: ['六号点', '描述'],
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
      innerLabelStyle: {
        padding: [2, 4],
        color: 'orange',
        fontSize: 16,
        offset: [0, 10],
      },
      markerStyleMap: [
        {
          value: 1,
          color: 'green',
          icon: 'Circle',
          innerLabelStyles: [
            {
              color: '#b70019',
              fontSize: 50,
              fontweight: 500,
            },
            {
              color: '#9e0693',
              fontSize: 90,
              fontweight: 600,
            },
          ],
        },
        {
          value: 2,
          color: 'red',
          icon: 'FivePointsStar',
          size: 40,
        },
        {
          value: 3,
          color: 'blue',
          icon: 'WaterDrop',
          size: 40,
          innerLabelStyles: [
            {
              color: 'purple',
              fontSize: 12,
            },
            {
              color: 'red',
              fontSize: 14,
            },
          ],
          innerLabelStyle: {
            padding: [6, 10],
          },
        },
        {
          value: 4,
          innerLabelStyle: {
            padding: [6, 10],
            offset: [10, 10],
          },
        },
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
