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

  watch: {
    location: {
      hanlder  (value) {
        this.createInfoWindow({
          location: value,
          content: this.infoWindowHtml,
        });
      },
      immediate: true,
    },
    infoWindowHtml: {
      hanlder (value) {
        this.createInfoWindow({
          location: this.location,
          content: value,
        });
      },
      immediate: true,
    },
  },

  methods: {
    mapLoadedFunc () {
      this.$emit('infowindow-ready');
    },
    createInfoWindow ({ location, content }) {
      const { offset = [0, -8] } = this.options;
      this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        content,
        offset: new AMap.Pixel(offset[0], offset[1]),
        ...this.options,
      });
      this.infoWindow.open(
        this.map,
        location,
      );
      this.$emit('window-opened', this.infoWindow);
    },

    close () {
      this.infoWindow.close();
      this.map.clearInfoWindow();
      this.$emit('window-closed');
    },
  },

  render () {
    return null;
  },
};

export default InfoWindow;
</script>
