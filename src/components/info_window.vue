<script>
import MapMixin from '../mixins/map';

export const infoWindow =  {
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
    createInfoWindow () {
      const info = `${this.infoWindowHtml}`;

      this.infoWindow = new AMap.InfoWindow({
        content: info,
      });
      this.open();
      this.$emit('infoWindow-created', this.infoWindow);
    },

    close () {
      this.infoWindow.close();
    },

    open () {
      this.infoWindow.open(
        this.map,
        this.location
      );
    },
  },

  render () {
    return null;
  },
};

export default infoWindow;
</script>
