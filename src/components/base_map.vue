<template>
  <div class="container" :style="{ backgroundImage: 'url(' + mapOptions.background + ')' }">
    <el-map
      :accessToken="accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :mapStyle="mapOptions.style"
      @load="onMapLoaded">
      <el-markers :map="map" :markerOptions="markerOptions"/>
    </el-map>
  </div>
</template>

<script>
import { MglMap } from "vue-mapbox";
import Markers from "./markers.vue";
import PROFILE from '../resources/profile.vue';

export default {
  name: "BaseMap",
  components: {
    "el-map": MglMap,
    "el-markers": Markers
  },
  data() {
    return {
      profile: PROFILE,
      map: null,
      accessToken: "pk.eyJ1IjoiYmlnZGF0YWNkIiwiYSI6ImNqbjFkcW00ZTI4cGszd3J1Njk2aDg5Z2gifQ.0WBA8a87guYK9b4Tf3je5A",
      mapOptions: {
        zoom: PROFILE.parameter.zoom,
        center: PROFILE.parameter.center,
        style: PROFILE.parameter.style,
        background: PROFILE.parameter.background
      },
      markerOptions: PROFILE.parameter.layers.marker,
      regionsOptions: PROFILE.parameter.layers.regions
    };
  },
  methods: {
    onMapLoaded(event) {
      this.map = event.map;
    },
  }
};
</script>

<style>
  .container {
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
    z-index: 1;
  }

  .container::before {
    background: "#333";
    content: "";
    height: 100%;
    opacity: .3;
    position: absolute;
    width: 100%;
    z-index: 2;
  }

  .mgl-map-wrapper {
    z-index: 4;
  }
</style>

