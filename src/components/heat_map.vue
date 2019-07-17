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
    heatPointColorMap: {
      type: Object,
      default: null,
    },
  },

  data () {
    return {
      heatMapInstance: null,
    };
  },

  watch: {
    heatPoints (current) {
      if (this.heatMapInstance) {
        this.heatMapInstance.setDataSet({ data: current });
      }
    },
  },

  methods: {
    mapLoadedFunc () {
      this.createHeatMap();
    },

    createHeatMap () {
      this.map.plugin(['AMap.Heatmap'], () => {
        this.heatMapInstance = new AMap.Heatmap(
          this.map,
          {
            radius: this.heatPointRadius,
            gradient: this.heatPointColorMap,
          }
        );
        this.heatMapInstance.setDataSet({ data: this.heatPoints });
      });
    },
  },
};

export default HeatMap;
</script>
