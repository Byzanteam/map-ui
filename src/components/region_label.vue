<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const DEFAULT_STYLE = {
  border: 'none',
  'background-color': 'transparent',
  color: '#fff',
  'font-weight': 'normal',
  'font-size': 18,
};

export const RegionLabel = {
  mixins: [MapMixin],

  props: {
    texts: {
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
      overlayGroup: null,
    };
  },

  watch: {
    texts: {
      deep: true,
      handler () {
        if (this.map) {
          this.clear();
          this._renderLabel();
        }
      },
    },
  },

  methods: {
    mapLoadedFunc () {
      this._renderLabel();
    },
    clear () {
      this.overlayGroup.hide();
      this.overlayGroup.clearOverlays();
    },
    _renderLabel () {
      const texts = _.map(this.texts, (label) => {
        const text = new AMap.Text({
          text: label.text,
          position: label.position,
          style: {
            ...DEFAULT_STYLE,
            ...this.labelStyle,
          },
        });
        text.setMap(this.map);
        return text;
      });
      this._generateOverlayGroup(texts);
    },
    _generateOverlayGroup (texts) {
      this.overlayGroup = new AMap.OverlayGroup(texts);
    },
  },
};

export default RegionLabel;
</script>
