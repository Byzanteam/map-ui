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
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Cluster from '../../src/components/cluster';
import MARKERS from './point.json';

export default {
  components: {
    BaseMap,
    Cluster,
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
          value: 5,
          color: '#dc7626',
          size: 5,
          type: 'circle',
          borderColor: 'rgba(138, 210, 155, 1)',
          innerLabelStyle: {
            color: 'purple',
          },
        },
        {
          value: 10,
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
          value: 15,
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
};
</script>
