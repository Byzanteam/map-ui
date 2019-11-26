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
    createInfoWindow (content, location) {
      this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        content: `${content}`,
        offset: new AMap.Pixel(0, -8),
      });
      this.open(location);
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
