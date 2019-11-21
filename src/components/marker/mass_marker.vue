<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';

const MASS_OPTIONS =  {
  opacity: 0.8,
  zIndex: 111,
};

const STYLES = [
  {
    url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
    anchor: [6, 6],
    size: [11, 11],
  },
  {
    url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
    anchor: [4, 4],
    size: [7, 7],
  },
];

export const MassMarker = {
  name: 'MassMarker',

  mixins: [MapMixin],

  props: {
    markers: {
      type: Array,
      default: () => ([]),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    styles: {
      type: Array,
      default: () => STYLES,
    },
  },

  watch: {
    markers (value) {
      this.clear();
      if (this.mass) {
        this.mass.setData(value);
      }
    },
  },

  data () {
    return {
      mass: null,
    };
  },

  computed: {
    massStyles () {
      return _.map(this.styles, style => ({
        ...style,
        anchor: new AMap.Pixel(style.anchor[0], style.anchor[1]),
        size: new AMap.Size(style.size[0], style.size[1]),
      }));
    },
  },

  methods: {
    mapLoadedFunc () {
      this._renderMass(this.markers);
    },
    _renderMass (markers) {
      this.mass = new AMap.MassMarks(markers, {
        ...MASS_OPTIONS,
        cursor: 'pointer',
        style: this.massStyles,
        ...this.options,
      });
      this.mass.on('click', e => this.$emit('mass-clicked', e));
      this.mass.on('mouseover', e => this.$emit('mass-mouseover', e));
      this.mass.on('mouseout', e => this.$emit('mass-mouseout', e));
      this.mass.setMap(this.map);
    },
    clear () {
      if (this.mass) {
        this.mass.clear();
      }
    },
  },
  render () {
    return null;
  },
};
export default MassMarker;
</script>
