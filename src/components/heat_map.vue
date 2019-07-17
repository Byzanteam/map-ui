<script>
import MapMixin from '../mixins/map';

export const HeatMap = {
  name: 'HeatMap',

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

export default HeatMap;
</script>
