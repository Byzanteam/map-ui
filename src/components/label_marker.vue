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
  },

  data () {
    return {
      labelLayer: null,
    };
  },

  methods: {
    mapLoadedFunc () {
      this.labelLayer = new AMap.LabelsLayer();
      this.map.add(this.labelLayer);
      _.each(this.labelMarkers, (item) => {
        const label = _.cloneDeep(item);
        label.text.style = {
          ...DEFAULT_STYLE,
          ...item.text.style,
        };
        this.labelLayer.add(new AMap.LabelMarker(label));
      });
    },

    clear () {
      this.labelLayer.clear();
    },
  },
};

export default LabelMarker;
</script>
