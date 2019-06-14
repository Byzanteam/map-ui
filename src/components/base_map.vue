<template>
  <div class="container" :style="containerStyle">
    <el-map
      :accessToken="mapOptions.accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :mapStyle="mapOptions.style"
      @load="onMapLoaded">
      <el-markers :markerOptions="markerOptions"/>
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
      map: null,
      mapOptions: {},
      markerOptions: {},
      regionsOptions: {},
      containerStyle: {}
    };
  },
  created() {
    this.mapOptions = PROFILE.parameter;
    this.markerOptions = PROFILE.parameter.layers.marker;
    this.regionsOptions = PROFILE.parameter.layers.regions;
    this.containerStyle = { backgroundImage: 'url(' + this.mapOptions.background + ')' }
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
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    z-index: 1;
  }

  .container::before {
    background: #333;
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

