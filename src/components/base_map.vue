<template>
  <div class="container">
    <el-map
      :accessToken="accessToken"
      :mapStyle="mapStyle"
      @load="onMapLoaded">
      <el-regions-layer :regionsOptions="regionsOptions" />
    </el-map>
  </div>
</template>

<script>
import { MglMap } from "vue-mapbox";
import Mapbox from "mapbox-gl";
import VRegionsLayer from "./regionsLayer"
import PROFILE from '../resources/profile.vue'

export default {
  name: "BaseMap",
  components: {
    "el-map": MglMap,
    "el-regions-layer": VRegionsLayer
  },
  data() {
    return {
      profile: PROFILE,
      map: null,
      accessToken: "pk.eyJ1IjoiYmlnZGF0YWNkIiwiYSI6ImNqbjFkcW00ZTI4cGszd3J1Njk2aDg5Z2gifQ.0WBA8a87guYK9b4Tf3je5A", // your access token. Needed if you using Mapbox maps
      mapStyle: {
        // mapbox样式版本号，必需的配置，值一定为8
        "version": 8, //TODO 改成常量
        "zoom": 10,
        "center": [],
        // 当使用text-field布局的必需的以PBF加载字集的url模板
        "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        "sources": {},
        "layers": []
      },
      regionsOptions: null
    };
  },

  created() {
    this.parseMaptyle()
    this.parseRegionsLayers()
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
  }
</style>

