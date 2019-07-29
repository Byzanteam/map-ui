<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <cluster
      :markers="pointData"
      :marker-style-map="markerStyleMap"
      :cluster-style-map="clusterStyleMap"
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
      markerStyleMap: [
        { value: 1, color: 'green' },
        { value: 2, color: 'red' },
        { value: 3, color: 'black' },
      ],
      clusterStyleMap: [
        {
          count: 2, color: '#dc7626', size: 10, type: 'triangle',
        },
        {
          count: 6, color: '#891ba0', size: 15, type: 'circle',
        },
        {
          count: 10, color: '#1967ab', size: 15, type: 'pentagram',
        },
      ],
    };
  },
};
</script>
