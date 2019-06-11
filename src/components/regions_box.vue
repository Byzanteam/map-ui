<template>
  <div>
    <el-regions-layer :regionsOptions="regionsLayerOptions" />
    <el-regions-layer :regionsOptions="highlightLayerOptions" v-if="highlightLayerOptions"/>
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
    this.regionsLayerOptions = this.initRegionsLayer(
      this.regionsOptions.elements,
      this.regionsOptions.data
    );
  },
  methods: {
    initRegionsLayer(layers, data) {
      return {
        "fill_layer_options": this.parseRegionsFillLayer(layers.background, data),
        "line_layer_options": this.parseRegionsLineLayer(layers.outline, data)
      }
    },
    parseRegionsFillLayer(profile, geojson) {
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
          "data": geojson
        }
      }
      this.addSource(profile.name, geojson);
      this.bindEvents(profile.events, `${profile.name}FillLayer`);
      return fill_layer;
    },
    parseRegionsLineLayer(profile, geojson) {
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
          "data": geojson
        }
      }
      this.addSource(profile.name, geojson);
      this.bindEvents(profile.events, `${profile.name}LineLayer`);
      return line_layer;
    },
    addSource(sourceId, geojson){
      let source = this.map.getSource(sourceId)
      if(source){
        source.setData(geojson)
      } else {
        this.map.addSource(sourceId, {
          type: "geojson",
          data: geojson
        })
      }
    },
    bindEvents(events, layerId) {
      _.forOwn(events, (funcName, event) => {
        this.map.on(event, layerId, (e) => {
          this[funcName](e, layerId)
        })
      })
    },
    hightlight(e, layerId) {
      let features = this.map.queryRenderedFeatures([e.point.x, e.point.y], { layers: [layerId] });
      let highlight_regions_geojson = _.assignIn({
        "type":"FeatureCollection",
        "features": [_.pick(features[0], ["type", "properties", "geometry"])]
      })
      this.drawHighlightLayer(highlight_regions_geojson);
    },
    drawHighlightLayer(geojson) {
      // fix 事件重复绑定
      this.highlightLayerOptions = this.initRegionsLayer(
        this.regionsOptions.elements.highlight,
        geojson
      )
    },
  }
}
</script>

<style>

</style>
