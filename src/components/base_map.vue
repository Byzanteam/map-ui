<template>
  <div
    class="container"
    :style="containerStyle">
    <MglMap
      :accessToken="mapOptions.accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :mapStyle="mapOptions.style"
      @load="onMapLoaded">
      <Cluster
        :map="map"
        :clusterOptions="clusterOptions"
        :mapApi="mapApi"
        @addMarker="addMarkerFunc" />
    </MglMap>
  </div>
</template>

<script>
import { MglMap } from 'vue-mapbox';
import PROFILE from '../resources/profile';
import Cluster from './cluster.vue';

export default {
  name: 'BaseMap',
  components: {
    MglMap,
    Cluster,
  },
  data() {
    return {
      map: null,
      mapOptions: PROFILE.parameter,
      markerOptions: PROFILE.parameter.layers.marker,
      regionsOptions: PROFILE.parameter.layers.regions,
      clusterOptions: PROFILE.parameter.layers.clusters,
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
    onMapLoaded (event) {
      this.map = event.map;
    },
    mapApi (apiName, options) {
      return this.map[apiName](...options);
    },
    addMarkerFunc(marker) {
      marker.addTo(this.map);
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

