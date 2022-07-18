<script>
import MapMixin from '../mixins/map';

export const CustomPolygon =  {
  name: 'CustomPolygon',

  mixins: [MapMixin],

  props: {
    polyStyle: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      polygon: null,
      polyEditor: null,
    };
  },

  watch: {
    path (value) {
      this.polygon.setPath(value);
    },
    polyStyle (value) {
      if (this.polygon) {
        this.polygon.setOptions(value);
      }
    },
  },

  methods: {
    mapLoadedFunc () {
      this.createPolygon();
      this.$emit('poly-ready');
    },
    createPolygon () {
      this.polygon = new AMap.Polygon({
        path: this.path,
        ...this.polyStyle,
        zIndex: 50,
      });
      this.map.add(this.polygon);
      this.map.setFitView([this.polygon]);
      this.map.plugin(['AMap.PolyEditor'], () => {
        this.polyEditor = new AMap.PolyEditor(this.map, this.polygon);
      });
    },
    open () {
      if (this.polyEditor) {
        this.polyEditor.open();
      }
    },
    close () {
      if (this.polyEditor) {
        this.polyEditor.close();
      }
    },
  },

  render () {
    return null;
  },
};

export default CustomPolygon;
</script>
