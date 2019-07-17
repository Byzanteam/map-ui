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
    heatPointRadius: {
      type: Number,
      default: 20,
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
          {
            radius: this.heatPointRadius,
          }
        );
        heatmap.setDataSet({ data: this.heatPoints });
      });
    },
  },
};

export default HeatMap;
</script>
