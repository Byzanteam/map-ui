<template>
  <div class="container" :style="{ backgroundImage: 'url(' + profile.parameter.background + ')' }">
    <el-map
      :accessToken="accessToken"
      :zoom="profile.parameter.zoom"
      :center="profile.parameter.center"
      :mapStyle="profile.parameter.style"
      @load="onMapLoaded">
      <el-regions-box
        :regionsOptions="regionsOptions"
        :map="map" />
    </el-map>
  </div>
</template>

<script>
import { MglMap } from "vue-mapbox";
import RegionsBox from "./regions_box";
import PROFILE from '../resources/profile.vue';

export default {
  name: "BaseMap",
  components: {
    "el-map": MglMap,
    "el-regions-box": RegionsBox,
  },
  data() {
    return {
      profile: PROFILE,
      map: null,
      accessToken: "pk.eyJ1IjoiYmlnZGF0YWNkIiwiYSI6ImNqbjFkcW00ZTI4cGszd3J1Njk2aDg5Z2gifQ.0WBA8a87guYK9b4Tf3je5A",
      regionsOptions: null
    };
  },

  created() {
    this.parseRegionsLayers();
  },

  methods: {
    onMapLoaded(event) {
      this.map = event.map;
    },
    parseMaptyle() {
      this.mapStyle["center"] = this.profile.parameter.center;
      this.mapStyle["zoom"] = this.profile.parameter.zoom;
      this.mapStyle["style"] = this.profile.parameter.style;
    },
    parseRegionsLayers() {
      this.regionsOptions = this.profile.parameter.layers.regions
    }
  }
};
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1;
    background-size: 100% 100%;
  }

  .container::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: #333;
    opacity: .3;
  }

  .mgl-map-wrapper {
    z-index: 4;
  }
</style>

