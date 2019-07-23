<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const DEFAULT_STYLE = {
  fontSize: 18,
  fontWeight: 'normal',
  fillColor: '#fff',
};

export const LabelMarker =  {
  mixins: [MapMixin],

  props: {
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
    labelContents () {
      _.reduce(this.labelMarkers, (result, label_marker) => {
        let memo = result;
        memo += label_marker.text.content;
        return memo;
      }, '');
    },
  },

  watch: {
    labelContents () {
      if (this.map) {
        this.clear();
        this._renderLabelMarker();
      }
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
      this.labelLayer = new AMap.LabelsLayer();
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
      });
    },
  },
};

export default LabelMarker;
</script>
