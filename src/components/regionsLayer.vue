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
      regionsFillLayer: null,
      regionsLineLayer: null,
      sourceData: null
    }
  },
  created() {
    this.parseRegionsFillLayer();
    this.parseRegionsLineLayer();
    this.parseSourceData();
  },
  methods: {
    parseSourceData() {
      this.sourceData = {
        "type": "geojson",
        "data": this.regionsOptions.data
      }
    },
    parseRegionsFillLayer() {
      let fill_profile = this.regionsOptions.elements.background.style;
      if (!fill_profile) return;
      this.regionsFillLayer = {
        'id': `${this.regionsOptions.name}-fill`,
        'type': 'fill',
        'paint': {
          'fill-color': fill_profile.color,
          'fill-opacity': fill_profile.opacity
        }
      }
      this.bindEvents(fill_profile.events, `${this.regionsOptions.name}-fill`);
    },
    parseRegionsLineLayer() {
      let line_profile = this.regionsOptions.elements.outline.style;
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
      this.bindEvents(line_profile.events, `${this.regionsOptions.name}-line`);
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
