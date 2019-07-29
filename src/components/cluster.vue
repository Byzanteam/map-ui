<script>
import MapMixin from '../mixins/map';
import Icons from './marker/icons.json';

export default {
  name: 'Cluster',

  mixins: [MapMixin],

  props: {
    markers: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderCluster();
    },

    renderCluster () {
      const markers = this.map.getAllOverlays('marker');
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
