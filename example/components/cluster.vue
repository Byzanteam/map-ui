<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <cluster
      :markers="pointData"
      :cluster-style-map="clusterStyleMap"
      :inner-label-style="clusterInnerLabelStyle"
      cluster-key="value"
    >
      <marker-point
        :markers="pointData"
      />
      <marker-point
        :markers="pointData2"
      />
    </cluster>
  </base-map>
</template>

<script>
import _ from 'lodash';
import BaseMap from '../../src/components/map.vue';
import Cluster from '../../src/components/cluster';
import MarkerPoint from '../../src/components/marker';
import MARKERS from './point.json';

export default {
  components: {
    BaseMap,
    Cluster,
    MarkerPoint,
  },

  data () {
    return {
      pointData: MARKERS,
      clusterInnerLabelStyle: {
        fontSize: 14,
        fontWeight: 100,
      },
      clusterStyleMap: [
        {
          value: 1,
          color: 'red',
          size: 5,
          type: 'circle',
          borderColor: 'rgba(138, 210, 155, 1)',
          innerLabelStyle: {
            color: 'purple',
          },
        },
        {
          value: 2,
          color: '#dc7626',
          size: 5,
          type: 'circle',
          borderColor: 'rgba(138, 210, 155, 1)',
          innerLabelStyle: {
            color: 'purple',
          },
        },
        {
          value: 5,
          color: '#891ba0',
          size: 10,
          type: 'circle',
          borderColor: 'rgba(120, 140, 125, 1)',
          innerLabelStyle: {
            fontSize: 14,
            color: 'blue',
          },
        },
        {
          value: 10,
          color: '#1967ab',
          size: 15,
          type: 'circle',
          borderColor: 'rgba(189, 145, 215, 1)',
          innerLabelStyle: {
            fontSize: 16,
            color: 'red',
          },
        },
        {
          value: 20,
          color: '#1496ab',
          size: 20,
          type: 'circle',
          borderColor: 'rgba(189, 215, 205, 1)',
          innerLabelStyle: {
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
};
</script>
