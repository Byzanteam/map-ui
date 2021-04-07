<template>
  <base-map
    :map-options="{
      viewMode: '3D',
      pitch: 30,
      rotation: 0,
      zoom: 13,
      center: [104.049835, 30.566256],
      showIndoorMap: false,
      showBuildingBlock:false,
      skyColor: '#5A75C6'
    }"
    map-style="amap://styles/47544281fde20c50707a56083af07455"
    :use-map-ui="true"
  >
    <simple-marker
      :markers="pointData"
      :marker-label-style="markerLabelStyle"
      :marker-style="markerStyle"
      :marker-style-map="markerStyleMap"
      icon="waterDrop"
    />
    <object3-d
      :model-source-path="modelPath"
      :light-option="lightOption"
      :model-option="modelOption"
      @modelClick="modelClick"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Object3D from '../../src/components/object3D';
import SimpleMarker from '../../src/components/marker/simple_marker';

const MARKERS = [
  {
    id: 1,
    location: [104.049835, 30.562256],
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
    location: [104.049435, 30.566056],
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
    label: [''],
    img: 'http://photocdn.sohu.com/20130925/Img387224863.jpg',
  },
  {
    id: 3,
    location: [104.049135, 30.564156],
    value: 2,
    label: '三号点',
    img: 'http://static01.lvye.com/portal/201604/28/093110pb7151d134r1rvet.jpg',
  },
  {
    id: 4,
    location: [104.045235, 30.566156],
    value: 2,
    label: '四号点',
  },
];

export default {
  components: {
    BaseMap,
    Object3D,
    SimpleMarker,
  },

  data () {
    return {
      modelPath: ['test/test7.gltf'],
      lightOption: {
        ambientLight: [[1, 1, 1], 1],
        directionLight: [[0, -1, 1], [1, 1, 1], 1],
      },
      modelOption: {
        position: [104.04969, 30.566186],
        scale: 7.75,
        height: 10,
        scene: 0,
      },
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

  methods: {
    modelClick (index, object, point, distance) {
      console.log(index, object, point, distance);
    },
  },
};
</script>
