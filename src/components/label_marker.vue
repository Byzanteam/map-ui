<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const LABEL_MARKER_STYLE = {
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

  methods: {
    mapLoadedFunc () {
      const layer = new AMap.LabelsLayer();
      this.map.add(layer);
      _.each(this.labelMarkers, (label) => {
        label.text.style = {
          ...LABEL_MARKER_STYLE,
          ...label.text.style,
        };
        layer.add(new AMap.LabelMarker(label));
      });
    },
  },
};

export default LabelMarker;
</script>
