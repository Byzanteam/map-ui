<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    :map-js-api-version="'1.4.15'"
    :map-ui-version="'1.0.11'"
    :map-key="'589b5c001b469482903a085837155e99'"
    use-map-ui
  >
    <stratum-marker
      :markers="pointData"
      :marker-style-map="markerStyleMap"
      :inner-label-style="innerLabelStyle"
      icon="waterDrop"
      @marker-clicked="markerClickedFunc"
    />
  </base-map>
</template>

<script>
import StratumMarker from '../../src/components/marker/stratum_marker';
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
    StratumMarker,
    BaseMap,
  },

  data () {
    return {
      pointData: [],
      innerLabelStyle: {
        padding: [2, 4],
        offset: [0, 10],
        textStyleMap: [
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
            textStyleMap: [
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
            textStyleMap: [
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
