<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    use-map-ui
  >
    <marker-group
      :markers="pointData"
      :marker-style-map="markerStyleMap"
      :inner-label-style="innerLabelStyle"
      icon="waterDrop"
      @marker-clicked="markerClickedFunc"
    />
  </base-map>
</template>

<script>
import MarkerGroup from '../../src/components/marker/class_marker';
import BaseMap from '../../src/components/map.vue';

const MARKERS = [
  {
    id: 1,
    location: [116.258446, 37.686622],
    value: 0,
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
    location: [116.286968, 39.883742],
    value: 3,
    label: ['五号点', '描述'],
  },
  {
    id: 6,
    location: [116.286968, 39.863642],
    value: 5,
    label: ['六号点', '描述'],
  },
];

export default {
  components: {
    MarkerGroup,
    BaseMap,
  },

  data () {
    return {
      pointData: [],
      innerLabelStyle: {
        padding: [2, 4],
        offset: [0, 10],
        textStyles: [
          {

            color: 'orange',
            fontSize: 16,

          },
          {
            color: 'red',
            fontSize: 12,
          },
        ],
      },
      markerStyleMap: [
        {
          value: 1,
          color: 'green',
          icon: 'triangle',
          size: 80,
          strokeWidth: 10,
          strokeColor: 'blue',
          innerLabelStyle: {
            textStyles: [
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
        },
        {
          value: 2,
          color: 'red',
          icon: 'fivePointsStar',
          size: 40,
          strokeWidth: 3,
          strokeColor: 'purple',
        },
        {
          value: 3,
          color: 'blue',
          icon: 'waterDrop',
          size: 40,
          innerLabelStyle: {
            textStyles: [
              {
                color: 'purple',
                fontSize: 12,
              },
              {
                color: 'red',
                fontSize: 14,
              },
            ],
          },
        },
        {
          value: 4,
          strokeWidth: 3,
          strokeColor: 'orange',
        },
      ],
    };
  },

  mounted () {
    this.pointData = MARKERS;
  },

  methods: {
    markerClickedFunc () {
      this.pointData = [];
    },
  },
};
</script>
