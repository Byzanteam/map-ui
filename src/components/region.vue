<template>
  <div class="layers-wrapper">
    <mgl-geojson-layer
      :source-id="sourceId"
      :layer-id="`${sourceId}fill`"
      :layer="regionsFillLayer.style"
    />
    <mgl-geojson-layer
      :source-id="sourceId"
      :layer-id="`${sourceId}line`"
      :layer="regionsLineLayer.style"
    />
  </div>
</template>

<script>
import { MglGeojsonLayer } from 'vue-mapbox';
import _ from 'lodash';

export default {
  name: 'RegionsLayer',
  components: {
    MglGeojsonLayer,
  },
  props: {
    mapApi: {
      type: Function,
      required: true,
    },
    regionsOptions: {
      type: Object,
      default () {
        return {};
      },
    },
    source: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      regionsLayerOptions: {},
    };
  },
  computed: {
    regionsFillLayer () {
      return this.regionsLayerOptions.fill_layer_options;
    },
    regionsLineLayer () {
      return this.regionsLayerOptions.line_layer_options;
    },
    sourceId () {
      return this.source.properties.id;
    },
  },
  created () {
    this.initRegionsLayer(this.regionsOptions.elements);
    this.bindEvents(this.regionsFillLayer.events, `${this.sourceId}fill`);
    this.bindEvents(this.regionsLineLayer.events, `${this.sourceId}line`);
  },
  methods: {
    initRegionsLayer (layers) {
      this.regionsLayerOptions = {
        fill_layer_options: this.parseRegionsFillLayer(layers.background),
        line_layer_options: this.parseRegionsLineLayer(layers.outline),
      };
    },
    parseRegionsFillLayer (profile) {
      const { color, opacity } = profile.style;
      return {
        style: {
          type: 'fill',
          paint: {
            'fill-color': color,
            'fill-opacity': opacity,
          },
        },
        events: profile.events,
      };
    },
    parseRegionsLineLayer (profile) {
      const {
        color,
        width,
        opacity,
        dasharray,
      } = profile.style;
      return {
        style: {
          type: 'line',
          paint: {
            'line-color': color,
            'line-width': width,
            'line-opacity': opacity,
            'line-dasharray': dasharray,
          },
        },
        events: profile.events,
      };
    },
    bindEvents (events, layerId) {
      _.forOwn(events, (funcName, event) => {
        this.mapApi('on', [event, layerId, this[funcName]]);
      });
    },
    highlight () {
      this.initRegionsLayer(this.regionsOptions.elements.highlight);
    },
    highlightCancel () {
      this.initRegionsLayer(this.regionsOptions.elements);
    },
  },
};
</script>
