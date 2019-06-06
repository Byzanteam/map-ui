<template>
  <div>
    <MglGeojsonLayer
      :sourceId="regionsFillLayer.soure.id"
      :source="regionsFillLayer.soure.data"
      :layerId="regionsFillLayer.id"
      :layer="regionsFillLayer"
    />
    <MglGeojsonLayer
      :sourceId="regionsLineLayer.soure.id"
      :source="regionsLineLayer.soure.data"
      :layerId="regionsLineLayer.id"
      :layer="regionsLineLayer"
    />
  </div>
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";
import _ from 'lodash';

export default {
  name: "RegionsLayer",
  props: {
    map: {
      type: Object,
      default () {
        return null;
      }
    },
    regionsOptions: {
      type: Object,
      default () {
        return null;
      }
    }
  },
  components: {
    MglGeojsonLayer,
  },
  data () {
    return {
      regionsFillLayer: this.regionsOptions.fill_layer_options,
      regionsLineLayer: this.regionsOptions.line_layer_options
    }
  }
}
</script>
