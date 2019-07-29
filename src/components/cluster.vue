<template>
  <marker-point
    :markers="markers"
    :marker-style-map="markerStyleMap"
    icon="water-droplet"
    @markersRendered="renderCluster"
  />
</template>

<script>
import MapMixin from '../mixins/map';
import Icons from './marker/icons.json';
import MarkerPoint from '../../src/components/marker';

export default {
  name: 'Cluster',

  components: {
    MarkerPoint,
  },

  mixins: [MapMixin],

  props: {
    markers: {
      type: Array,
      default: () => [],
    },
    markerStyleMap: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    renderCluster (markers) {
      this.map.plugin(['AMap.MarkerClusterer'], () => {
        const cluster = new AMap.MarkerClusterer(
          this.map,
          markers,
          {
            gridSize: 80,
          }
        );
        cluster.on('click', e => (this.$emit('clusterClick', e)));
      });
    },
  },
};
</script>
