<template>
  <div class="container" :style="containerStyle">
    <el-map
      :accessToken="mapOptions.accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :mapStyle="mapOptions.style"
      @load="onMapLoaded">
      <el-regions-box
        :regionsOptions="regionsOptions"
        :mapOn="mapOn"
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
      map: null,
      mapOptions: {},
      markerOptions: {},
      regionsOptions: {},
      containerStyle: {},
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
    mapOn (event, layer_id, func) {
      this.map.on(event, layer_id, (e) => {
        func();
      })
    }
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

