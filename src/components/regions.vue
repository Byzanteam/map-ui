<template>
  <div>
    <MglGeojsonLayer
      :sourceId="source.properties.id"
      :source="source"
      :layerId="source.properties.id + 'fill'"
      :layer="regionsFillLayer.style"
    />
    <MglGeojsonLayer
      :sourceId="source.properties.id"
      :source="source"
      :layerId="source.properties.id + 'line'"
      :layer="regionsLineLayer.style"
    />
  </div>
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";
import _ from 'lodash';

export default {
  name: "RegionsLayer",
  components: {
    MglGeojsonLayer,
  },
  props: {
    mapOn: {
      type: Function,
      required: true,
    },
    regionsOptions: {
      type: Object,
      default () {
        return {};
      }
    },
    source: {
      type: Object,
      default () {
        return {};
      }
    },
  },
  data () {
    return {
      regionsLayerOptions: {},
    }
  },
  computed: {
    regionsFillLayer(){
      return this.regionsLayerOptions.fill_layer_options
    },
    regionsLineLayer() {
      return this.regionsLayerOptions.line_layer_options
    }
  },
  created () {
    this.initRegionsLayer(this.regionsOptions.elements);
    this.bindEvents(this.regionsFillLayer.events, this.source.properties.id + 'fill');
    this.bindEvents(this.regionsLineLayer.events, this.source.properties.id + 'line');
  },
  methods: {
    initRegionsLayer(layers) {
      this.regionsLayerOptions  = {
        "fill_layer_options": this.parseRegionsFillLayer(layers.background),
        "line_layer_options": this.parseRegionsLineLayer(layers.outline)
      }
    },
    parseRegionsFillLayer(profile) {
      let fill_layer = {
        "style": {
          "type": "fill",
          "paint": {
            "fill-color": profile.style.color,
            "fill-opacity": profile.style.opacity
          },
        },
        "events": profile.events
      }
      return fill_layer;
    },
    parseRegionsLineLayer(profile) {
      let line_layer = {
        "style": {
          "type": "line",
          "paint": {
            "line-color": profile.style.color,
            "line-width": profile.style.width,
            "line-opacity": profile.style.opacity,
            "line-dasharray": profile.style.dasharray
          },
        },
        "events": profile.events
      }
      return line_layer;
    },
    bindEvents (events, layerId) {
      _.forOwn(events, (funcName, event) => {
        this.mapOn(event, layerId, this[funcName]);
      });
    },
    hightlight() {
      this.initRegionsLayer(this.regionsOptions.elements.highlight);
    },
  }
}
</script>
