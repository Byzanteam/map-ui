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
    labels: {
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
      texts: [],
    };
  },

  watch: {
    labels: {
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

    _renderLabel () {
      _.each(this.labels, (label) => {
        const text = new AMap.Text({
          text: label.text,
          position: label.position,
          style: {
            ...DEFAULT_STYLE,
            ...this.labelStyle,
          },
        });
        this.texts.push(text);
        text.setMap(this.map);
      });
    },

    clear () {
      _.each(this.texts, (text) => {
        text.hide();
      });
      this.texts = [];
    },
  },
};

export default RegionLabel;
</script>
