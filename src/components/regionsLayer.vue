<template>
  <div class="container">
    <MglGeojsonLayer
      sourceId="regionsLayer"
      :source="sourceData"
      layerId="myLayer"
      :layer="regionsLineLayer"
    />
  </div>
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";

export default {
  name: "RegionsLayer",
  props: {
    regionsOptions: {
      type: Object,
      default () {
        return null;
      },
    },
  },
  components: {
    MglGeojsonLayer,
  },
  data () {
    return {
      regionsLineLayer: null,
      sourceData: null
    }
  },

  created() {
    this.regionsLineLayer = {
      'id': 'sichuan-fill',
      'type': 'fill',
      'paint': {
        'fill-color': '#006d2c',
        'fill-opacity': .2,
        'fill-antialias': true,
        'fill-outline-color': '#ed6498'
      }
    }
    this.sourceData = {
      "type": "geojson",
      "data": this.regionsOptions.data
    }
  }
}
</script>
