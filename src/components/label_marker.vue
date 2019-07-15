<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

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
        layer.add(new AMap.LabelMarker(label));
      });
    },
  },
};

export default LabelMarker;
</script>
