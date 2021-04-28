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
    heatPointOpacity: {
      type: Array,
      default: () => [0, 1],
    },
    options: {
      type: Object,
      default: () => {},
    },
  },

  data () {
    return {
      heatMapInstance: null,
    };
  },

  watch: {
    heatPoints: {
      deep: true,
      handler () {
        this.setPointData(this.heatPoints);
      },
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
            opacity: this.heatPointOpacity,
            ...this.options,
          }
        );

        this.setPointData(this.heatPoints);
      });
    },

    setPointData (data) {
      if (this.heatMapInstance) {
        this.heatMapInstance.setDataSet({ data });
      }
    },

    clear () {
      this.setPointData([]);
    },
  },
};

export default HeatMap;
</script>
