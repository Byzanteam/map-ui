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
    data: {
      type: Object,
      default: () => {},
    },
  },

  data () {
    return {
      polygon: null,
      polyEditor: null,
      timer: null,
      initPath: [],
    };
  },

  watch: {
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
      const polygon = new AMap.Polygon({
        path: this.path,
        ...this.polyStyle,
        zIndex: 50,
        extData: this.data,
      });
      this.map.add(polygon);
      this.map.plugin(['AMap.PolyEditor'], () => {
        this.polyEditor = new AMap.PolyEditor(this.map, polygon);
        this.polyEditor.on('end', (e) => {
          this.$emit('edit-end', e.target);
        });
      });
      polygon.on('click', (e) => {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$emit('polygon-click', e, this.polyEditor);
        }, 300);
      });
      polygon.on('dblclick', (e) => {
        this.timer && clearTimeout(this.timer);
        this.open();
        this.$emit('polygon-dblclick', e, this.polyEditor);
      });
      this.polygon = polygon;
    },
    reset (paths) {
      this.polygon.setPath(paths);
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
