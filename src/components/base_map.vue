<template>
  <div class="container" :style="containerStyle">
    <MglMap
      :accessToken="mapOptions.accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :mapStyle="mapOptions.style"
      @load="onMapLoaded">
      <RegionsBox
        :regionsOptions="regionsOptions"
        :mapOn="mapOn"
        :mapGetSource="getSource"
        :mapAddSource="addSource" />
    </MglMap>
  </div>
</template>

<script>
import { MglMap } from "vue-mapbox";
import RegionsBox from "./regions_box.vue";
import PROFILE from '../resources/profile.vue';

export default {
  name: "BaseMap",
  components: {
    MglMap,
    RegionsBox,
  },
  data () {
    return {
      map: null,
      mapOptions: {},
      markerOptions: {},
      regionsOptions: {},
      containerStyle: {},
    };
  },
  created () {
    this.mapOptions = PROFILE.parameter;
    this.markerOptions = PROFILE.parameter.layers.marker;
    this.regionsOptions = PROFILE.parameter.layers.regions;
    this.containerStyle = { backgroundImage: 'url(' + this.mapOptions.background + ')' }
  },
  methods: {
    onMapLoaded (event) {
      this.map = event.map;
    },
    mapOn (event, layer_id, func) {
      this.map.on(event, layer_id, (e) => {
        func();
      })
    },
    getSource (id) {
      this.map.getSource(id)
    },
    addSource (id, options) {
      this.map.addSource(id, options)
    }
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

