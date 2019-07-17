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
    heatPointColorMapping: {
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
      this.pointDataSet(current);
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
            gradient: this.heatPointColorMapping,
          }
        );

        this.pointDataSet(this.heatPoints);
      });
    },

    pointDataSet (data) {
      if (this.heatMapInstance) {
        this.heatMapInstance.setDataSet({ data });
      }
    },

    clear () {
      this.pointDataSet([]);
    },
  },
};

export default HeatMap;
</script>
