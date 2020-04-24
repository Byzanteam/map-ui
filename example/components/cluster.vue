<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    use-map-ui
  >
    <cluster
      :cluster-style-map="clusterStyleMap"
      :label-style="clusterLabelStyle"
      :cluster-content="clusterContent"
    >
      <stratum-marker
        :markers="pointData"
      />
      <stratum-marker
        :markers="pointData2"
      />
    </cluster>
  </base-map>
</template>

<script>
import _ from 'lodash';
import BaseMap from '../../src/components/map.vue';
import Cluster from '../../src/components/cluster';
import StratumMarker from '../../src/components/marker/stratum_marker';
import cities from './cities';

export default {
  components: {
    BaseMap,
    Cluster,
    StratumMarker,
  },

  data () {
    return {
      clusterLabelStyle: {
        fontSize: 14,
        fontWeight: 100,
      },
      pointData: [
        {
          id: 1,
          location: [116.258446, 37.686622],
          value: 10,
          label: '10',
        },
        {
          id: 2,
          location: [113.559954, 22.124049],
          value: 2,
        },
        {
          id: 3,
          location: [116.366794, 39.915309],
          value: 2,
          label: '2',
        },
        {
          id: 4,
          location: [116.486409, 39.921489],
          value: 6,
          label: '6',
        },
        {
          id: 5,
          location: [116.286968, 39.863642],
          value: 4,
          label: '4',
        },
        {
          id: 1,
          location: [112.985037, 23.15046],
          value: 3,
          label: '3',
        },
        {
          id: 2,
          location: [110.361899, 20.026695],
          value: 3,
          label: '3',
        },
        {
          id: 3,
          location: [121.434529, 31.215641],
          value: 2,
          label: '2',
        },
        {
          id: 4,
          location: [120.682502, 28.011099],
          value: 2.4,
          label: '2.4',
        },
        {
          id: 5,
          location: [126.687123, 45.787618],
          value: 5.1,
          label: '5.1',
        },
        {
          id: 1,
          location: [103.970724, 30.397931],
          value: 3.2,
          label: '3.2',
        },
        {
          id: 2,
          location: [117.212164, 31.831641],
          value: 3,
        },
        {
          id: 3,
          location: [121.434529, 31.215641],
          value: 2.9,
          label: '2.9',
        },
        {
          id: 4,
          location: [121.411101, 31.059407],
          value: 3.9,
          label: '3.9',
        },
        {
          id: 5,
          location: [104.137953, 30.784276],
          value: 5.2,
          label: '5.2',
        },
        {
          id: 1,
          location: [114.397917, 23.545706],
          value: 0.4,
          label: '0.4',
        },
        {
          id: 2,
          location: [119.530013, 39.935889],
          value: 1.5,
        },
        {
          id: 3,
          location: [77.254607, 39.050215],
          value: 2.2,
          label: '2.2',
        },
        {
          id: 4,
          location: [120.626128, 30.822477],
          value: 2.67,
          label: '2.67',
        },
        {
          id: 5,
          location: [116.625662, 39.619879],
          value: 5,
          label: '5',
        },
        {
          id: 1,
          location: [113.377157, 31.797137],
          value: 0.1,
          label: '0.1',
        },
        {
          id: 2,
          location: [113.334007, 23.107744],
          value: 5.3,
        },
        {
          id: 3,
          location: [113.294417, 23.159512],
          value: 2,
          label: '2',
        },
        {
          id: 4,
          location: [117.287658, 31.873351],
          value: 2,
          label: '2',
        },
        {
          id: 5,
          location: [112.767577, 22.445482],
          value: 5.8,
          label: '5.8',
        },
        {
          id: 1,
          location: [115.471106, 30.787118],
          value: 0,
          label: '0',
        },
        {
          id: 2,
          location: [112.541595, 26.763181],
          value: 2,
        },
        {
          id: 3,
          location: [87.658551, 44.008315],
          value: 2,
          label: '2',
        },
        {
          id: 4,
          location: [119.364493, 32.328944],
          value: 12.4,
          label: '12.4',
        },
        {
          id: 5,
          location: [112.438353, 34.666416],
          value: 53.2,
          label: '53.2',
        },
      ],
      clusterStyleMap: [
        {
          limit: 1,
          color: 'red',
          size: 5,
          type: 'circle',
          borderColor: 'rgba(138, 210, 155, 1)',
          labelStyle: {
            color: 'purple',
          },
        },
        {
          limit: 2,
          color: '#dc7626',
          size: 5,
          type: 'circle',
          borderColor: 'rgba(138, 210, 155, 1)',
          labelStyle: {
            color: 'purple',
          },
        },
        {
          limit: 5,
          color: '#891ba0',
          size: 10,
          type: 'circle',
          borderColor: 'rgba(120, 140, 125, 1)',
          labelStyle: {
            fontSize: 14,
            color: 'blue',
          },
        },
        {
          limit: 10,
          color: '#1967ab',
          size: 15,
          type: 'circle',
          borderColor: 'rgba(189, 145, 215, 1)',
          labelStyle: {
            fontSize: 16,
            color: 'red',
          },
        },
        {
          limit: 20,
          color: '#1496ab',
          size: 20,
          type: 'circle',
          borderColor: 'rgba(189, 215, 205, 1)',
          labelStyle: {
            fontSize: 18,
            color: '#fff',
          },
        },
      ],
    };
  },

  computed: {
    pointData2 () {
      return _.map(this.pointData, (point) => {
        const point2 = {
          location: [point.location[0] + 0.3, point.location[1] + 0.2],
          value: point.value,
          label: point.label,
        };
        return point2;
      });
    },
  },

  methods: {
    clusterContent  (context) {
      const node = `<div
        style='width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: red;
        border: 3px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        line-height: 40px'>
          ${context.count}
        </div>`;
      context.marker.setContent(node);
    },
  },
};
</script>
