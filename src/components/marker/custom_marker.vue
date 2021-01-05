<script>
import MapMixin from '../../mixins/map';

export const CustomMarker = {
  mixins: [MapMixin],

  props: {
    marker: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
    },
    offset: {
      type: Array,
      default: () => [0, 0],
    },
    anchor: {
      type: String,
      default: 'bottom-center',
    },
    zIndex: {
      type: Number,
      default: 100,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    markerOptions () {
      return {
        marker: this.marker,
        options: this.options,
      };
    },
  },

  watch: {
    marker (value) {
      this.setMarkerData(value);
    },
    content (value) {
      this.instance.setContent(value);
    },
    offset (value) {
      this.instance.setOffset(value);
    },
    anchor (value) {
      this.instance.setAnchor(value);
    },
    zIndex (value) {
      this.instance.setzIndex(value);
    },
    options: {
      handler () {
        this.setMarkerData(this.marker);
      },
    },
  },

  methods: {
    mapLoadedFunc () {
      this.setMarkerData(this.marker);
    },

    setMarkerData (data) {
      this.clear();
      this.renderMarker(data);
    },

    renderMarker (marker) {
      this.instance = new AMap.Marker({
        ...this.options,
        position: new AMap.LngLat(marker.point[0], marker.point[1]),
        content: this.content,
        offset: new AMap.Pixel(this.offset[0], this.offset[1]),
        extData: marker,
        anchor: this.anchor,
        zIndex: this.zIndex,
      });

      this.instance.on('click', e => this.$emit('marker-clicked', e));
      this.instance.on('mouseover', e => this.$emit('marker-mouseover', e));
      this.instance.on('mouseout', e => this.$emit('marker-mouseout', e));
      this.$emit('marker-rendered', this.instance);

      this.map.add(this.instance);
    },

    show () {
      this.instance.show();
    },

    hide () {
      this.instance.hide();
    },

    setZIndexNumber (value) {
      if (this.instance) {
        this.instance.setzIndex(value);
      }
    },

    clear () {
      if (this.instance) {
        this.map.remove(this.instance);
      }
      this.instance = null;
    },
  },

};

export default CustomMarker;
</script>
