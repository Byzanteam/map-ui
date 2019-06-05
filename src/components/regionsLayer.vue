<template>
  <div>
    <MglGeojsonLayer
      sourceId="regionsFillLayer"
      :source="sourceData"
      layerId="myLayer"
      :layer="regionsFillLayer"
    />
    <MglGeojsonLayer
      sourceId="regionsLineLayer"
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
      regionsFillLayer: null,
      regionsLineLayer: null,
      sourceData: null
    }
  },
  created() {
    this.parseRegionsFillLayer();
    this.parseRegionsLineLayer();
    this.parseSourceData();
    this.bindEvents()
  },
  methods: {
    parseRegionsFillLayer() {
      let fill_profile = this.regionsOptions.style.background;
      if (!fill_profile) return;
      this.regionsFillLayer = {
        'id': `${this.regionsOptions.name}-fill`,
        'type': 'fill',
        'paint': {
          'fill-color': fill_profile.color,
          'fill-opacity': fill_profile.opacity
        }
      }
    },
    parseRegionsLineLayer() {
      let line_profile = this.regionsOptions.style.outline;
      if (!line_profile) return;
      this.regionsLineLayer = {
        'id': `${this.regionsOptions.name}-line`,
        'type': 'line',
        'paint': {
          'line-color': line_profile.color,
          'line-width': line_profile.width,
          "line-opacity": line_profile.opacity,
          'line-dasharray': line_profile.dasharray
        }
      }
    },
    parseSourceData() {
      this.sourceData = {
        "type": "geojson",
        "data": this.regionsOptions.data
      }
    },
    bindEvents() {
      this.map.on("click", `${this.regionsOptions.name}-fill`, (e) => this.callback(e, `${this.regionsOptions.name}-fill`))
    },
    callback(e, layerId) {
      console.log(e)
    }
  }
}
</script>
