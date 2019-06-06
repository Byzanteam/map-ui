<template>
  <div>
    <MglGeojsonLayer
      :sourceId="regionsFillLayer.source.id"
      :source.sync="regionsFillLayer.source"
      :layerId="regionsFillLayer.style.id"
      :layer="regionsFillLayer.style"
    />
    <MglGeojsonLayer
      :sourceId="regionsLineLayer.source.id"
      :source.sync="regionsLineLayer.source"
      :layerId="regionsLineLayer.style.id"
      :layer="regionsLineLayer.style"
    />
  </div>
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";
import _ from 'lodash';

export default {
  name: "RegionsLayer",
  props: {
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
