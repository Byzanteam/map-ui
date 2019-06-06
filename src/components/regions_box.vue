<template>
  <div>
    <el-regions-layer :regionsOptions="regionsLayerOptions" />
    <el-regions-layer :regionsOptions="highlightLayerOptions" />
  </div>
</template>

<script>
import VRegionsLayer from "./regionsLayer"

export default {
  components: {
    "el-regions-layer": VRegionsLayer
  },
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
  data () {
    return {
      regionsLayerOptions: null,
      highlightLayerOptions: null
    }
  },
  created() {
    this.initRegionsLayer();
    this.initHighlightLayer();
  },
  methods: {
    initRegionsLayer() {
      let layers = this.regionsOptions.elements;
      this.regionsLayerOptions = {
        "fill_layer_options": this.parseRegionsFillLayer(layers.background),
        "line_layer_options": this.parseRegionsLineLayer(layers.outline)
      }
    },
    initHighlightLayer() {
      let layers = this.regionsOptions.elements.highlight;
      this.highlightLayerOptions = {
        "fill_layer_options": this.parseRegionsFillLayer(layers.background),
        "line_layer_options": this.parseRegionsLineLayer(layers.outline)
      }
    },
    parseRegionsFillLayer(profile) {
      let fill_layer = {
        "style": {
          "id": `${profile.name}FillLayer`,
          "type": "fill",
          "paint": {
            "fill-color": profile.style.color,
            "fill-opacity": profile.style.opacity
          },
        },
        "source": {
          "id": profile.name,
          "type": "geojson",
          "data": this.regionsOptions.data
        }
      }
      this.addSource(profile.name, this.regionsOptions.data);
      this.bindEvents(profile.events, `${this.regionsOptions.name}-fill`);
      return fill_layer;
    },
    parseRegionsLineLayer(profile) {
      let line_layer = {
        "style": {
          "id": `${profile.name}LineLayer`,
          "type": "line",
          "paint": {
            "line-color": profile.style.color,
            "line-width": profile.style.width,
            "line-opacity": profile.style.opacity,
            "line-dasharray": profile.style.dasharray
          },
        },
        "source": {
          "id": profile.name,
          "type": "geojson",
          "data": this.regionsOptions.data
        }
      }
      this.bindEvents(profile.events, `${this.regionsOptions.name}-line`);
      return line_layer;
    },
    bindEvents(events, layerId) {
      _.forOwn(events, (funcName, event) => {
        this.map.on(event, layerId, (e) => {
          this[funcName](e, layerId)
        })
      })
    },
    hightlight (e) {
      console.log(e)
    }
  }
}
</script>

<style>

</style>
