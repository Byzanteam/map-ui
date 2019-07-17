<script>
import MapMixin from '../mixins/map';

export default {
  mixins: [MapMixin],

  props: {
    heatPoints: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    mapLoadedFunc () {
      this.createHeatMap();
    },

    createHeatMap () {
      this.map.plugin(['AMap.Heatmap'], () => {
        const heatmap = new AMap.Heatmap(
          this.map,
        );
        heatmap.setDataSet({ data: this.heatPoints });
      });
    },
  },
};
</script>
