<template>
  <base-map
    :map-options="{viewMode: '3D', zoom: 4}"
    :transparent="true"
  >
    <regions
      :label-data="labelData"
      :geo-json="geoJson"
      :custom-area="customArea"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Regions from '../../src/components/regions.vue';

const LABEL_DATA = require('../../source/label.json');
const GEOJSON = require('../../source/regions.json');
const CUSTOM_AREA = require('../../source/custom_area.json');

export default {
  components: {
    BaseMap,
    Regions,
  },

  created () {
    this.labelData = LABEL_DATA;
    this.geoJson = GEOJSON;
    this.customArea = CUSTOM_AREA;
  },
};
</script>

<style lang="scss">
  // move to reset, then let style be scoped
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
  }
</style>
