<script>
import MapMixin from '../mixins/map';

export const CanvasLayer = {
  mixins: [MapMixin],

  props: {
    draw: {
      type: Function,
      required: true,
    },
    canvas: {
      type: HTMLCanvasElement,
      required: true,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },

  data () {
    return {
      canvasLayer: null,
    };
  },

  watch: {
    draw  () {
      this.render();
    },
  },

  methods: {
    mapLoadedFunc () {
      this.render();
    },

    render () {
      if (!this.canvas) return;
      const { bounds } = this.options;
      this.canvasLayer = new AMap.CanvasLayer({
        map: this.map,
        canvas: this.canvas,
        ...this.options,
        bounds: new AMap.Bounds(
          bounds[0],
          bounds[1]
        ),
      });
      this.useDraw();
    },
    useDraw () {
      this.draw();
      this.canvasLayer.reFresh();
      AMap.Util.requestAnimFrame(this.useDraw);
    },
  },
};

export default CanvasLayer;
</script>
