<template>
  <div class="container" :style="{ backgroundImage: 'url(' + mapOptions.background + ')' }">
    <el-map
      :accessToken="accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :mapStyle="mapOptions.style"
      @load="onMapLoaded">
      <el-cluster :map="map" :clusterOptions="clusterOptions"></el-cluster>
    </el-map>
  </div>
</template>

<script>
import { MglMap } from "vue-mapbox";
import PROFILE from "../resources/profile.vue";
import Cluster from "./cluster.vue";

export default {
  name: "BaseMap",
  components: {
    "el-map": MglMap,
    "el-cluster": Cluster,
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
      clusterOptions: PROFILE.parameter.layers.clusters,
    };
  },
  methods: {
    onMapLoaded (event) {
      this.map = event.map;
    },
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

