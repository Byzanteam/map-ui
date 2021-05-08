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
      default: () => ([0, 0]),
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

  computed: {
    options () {
      return {
        location: this.location,
        content: this.infoWindowHtml,
        options: this.infoWindowOptions,
      };
    },
  },

  watch: {
    options (value) {
      this.createInfoWindow(value);
    },
  },

  methods: {
    mapLoadedFunc () {
      this.createInfoWindow(this.options);
      this.$emit('infowindow-ready');
    },

    createInfoWindow ({ location, content, options }) {
      const { offset = [0, -8] } = options;
      this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        content,
        ...options,
        offset: new AMap.Pixel(offset[0], offset[1]),
      });
      this.open(location);
    },

    close () {
      this.infoWindow.close();
      this.$emit('window-closed', this.infoWindow);
    },

    open (location) {
      if (this.infoWindow && !this.infoWindow.getIsOpen()
        && this.infoWindowHtml) {
        this.infoWindow.open(
          this.map,
          location || this.location,
        );
        this.$emit('window-opened', this.infoWindow);
      }
    },
  },

  render () {
    return null;
  },
};

export default InfoWindow;
</script>
