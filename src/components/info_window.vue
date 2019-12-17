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

  computed: {
    options () {
      return {
        location: this.location,
        infoWindowHtml: this.infoWindowHtml,
        infoWindowOptions: this.infoWindowOptions,
      };
    },
  },

  watch: {
    options ({ location, infoWindowHtml, infoWindowOptions }) {
      this.createInfoWindow({
        location,
        content: infoWindowHtml,
        options: infoWindowOptions,
      });
    },
  },

  methods: {
    mapLoadedFunc () {
      this.$emit('infowindow-ready');
    },

    createInfoWindow ({ location, content, options }) {
      const { offset = [0, -8] } = this.infoWindowOptions;
      this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        content,
        offset: new AMap.Pixel(offset[0], offset[1]),
        ...options,
      });
      this.open(location);
    },

    close () {
      this.infoWindow.close();
      this.$emit('window-closed');
    },

    open (location) {
      if (this.infoWindow && !this.infoWindow.getIsOpen()) {
        this.infoWindow.open(
          this.map,
          location,
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
