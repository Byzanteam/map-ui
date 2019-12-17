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
    infoWindowOptions: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      infoWindow: null,
    };
  },

  watch: {
    location (value) {
      this.createInfoWindow({
        location: value,
        content: this.infoWindowHtml,
      });
    },
    infoWindowHtml (value) {
      this.createInfoWindow({
        location: this.location,
        content: value,
      });
    },
  },

  methods: {
    mapLoadedFunc () {
      this.$emit('infowindow-ready');
    },

    createInfoWindow ({ location, content }) {
      const { offset = [0, -8] } = this.infoWindowOptions;
      this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        content,
        offset: new AMap.Pixel(offset[0], offset[1]),
        ...this.infoWindowOptions,
      });
      this.open(location);
      this.$emit('window-opened', this.infoWindow);
    },

    close () {
      this.infoWindow.close();
      this.$emit('window-closed');
    },

    open (location) {
      if (this.infoWindow) {
        this.infoWindow.open(
          this.map,
          location,
        );
      }
    },
  },

  render () {
    return null;
  },
};

export default InfoWindow;
</script>
