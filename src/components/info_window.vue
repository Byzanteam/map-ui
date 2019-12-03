<script>
import MapMixin from '../mixins/map';

export const InfoWindow =  {
  name: 'InfoWindow',

  mixins: [MapMixin],

  props: {
    infoWindowHtml: {
      type: [String, HTMLElement],
      default: '',
    },
    location: {
      type: Array,
      default: () => ([]),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      infoWindow: null,
    };
  },

  methods: {
    mapLoadedFunc () {
      this.$emit('infowindow-ready');
    },
    createInfoWindow (options) {
      const { offset = [0, -8] } = options;
      this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        content: options.content,
        offset: new AMap.Pixel(offset[0], offset[1]),
        ...this.options,
      });
      this.open(options.location);
      this.$emit('infoWindow-created', this.infoWindow);
    },

    close () {
      this.infoWindow.close();
      this.map.clearInfoWindow();
    },

    open (location) {
      this.infoWindow.open(
        this.map,
        location,
      );
    },
  },

  render () {
    return null;
  },
};

export default InfoWindow;
</script>
