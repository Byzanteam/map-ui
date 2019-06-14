<template>
  <div class="container" :style="containerStyle">
    <MglMap
      :accessToken="mapOptions.accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :mapStyle="mapOptions.style"
      @load="onMapLoaded">
      <Markers :markerOptions="markerOptions" />
    </MglMap>
  </div>
</template>

<script>
import { MglMap } from 'vue-mapbox';
import Markers from './markers.vue';
import PROFILE from '../resources/profile.vue';

export default {
  name: 'BaseMap',
  components: {
    MglMap,
    Markers,
  },
  data() {
    return {
      map: null,
      mapOptions: PROFILE.parameter,
      markerOptions: PROFILE.parameter.layers.marker,
      regionsOptions: PROFILE.parameter.layers.regions,
    };
  },
  computed: {
    containerStyle () {
      return {
        backgroundImage: `url(${ this.mapOptions.background })`
      };
    },
  },
  methods: {
    onMapLoaded(event) {
      this.map = event.map;
    },
  },
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

