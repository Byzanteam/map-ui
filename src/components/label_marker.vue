<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const DEFAULT_STYLE = {
        fontSize: 18,
        fontWeight: 'normal',
        fillColor: '#fff',
      },
      DEFAULT_PROPS_MAP = {
        position: 'position',
        text: 'text',
      };

export const LabelMarker =  {
  mixins: [MapMixin],

  props: {
    propsMap: {
      type: Object,
      default: () => ({}),
    },
    labelMarkers: {
      type: Array,
      default: () => [],
    },
    labelStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      labelLayer: null,
    };
  },

  computed: {
    textProp () {
      return this.propsMap.text || DEFAULT_PROPS_MAP.text;
    },

    positionProp () {
      return this.propsMap.position || DEFAULT_PROPS_MAP.position;
    },
  },

  watch: {
    labelMarkers: {
      deep: true,
      handler () {
        if (this.map) {
          this.clear();
          this._renderLabelMarker();
        }
      },
    },
  },

  methods: {
    mapLoadedFunc () {
      this._renderLabelMarker();
    },

    clear () {
      if (this.labelLayer) {
        this.labelLayer.clear();
      }
    },

    _renderLabelMarker () {
      // geoJSON is 110, 这个要比那个高才行
      this.labelLayer = new AMap.LabelsLayer({
        zIndex: 121,
      });
      this.map.add(this.labelLayer);
      _.each(this.labelMarkers, (item) => {
        const { position, text, style } = item;
        const label = {
          position,
          text: {
            content: text,
            direction: 'center',
            style: {
              ...DEFAULT_STYLE,
              ...this.labelStyle,
              ...style,
            },
          },
        };
        this.labelLayer.add(new AMap.LabelMarker(label));
        this.labelLayer.on('click', e => this.$emit('label-clicked', e, this.labelLayer));
        this.labelLayer.on('mouseover', e => this.$emit('label-mouseover', e, this.labelLayer));
        this.labelLayer.on('mouseout', e => this.$emit('label-mouseout', e, this.labelLayer));
      });
    },
  },

  beforeDestroy () {
    this.clear();
  },
};

export default LabelMarker;
</script>
