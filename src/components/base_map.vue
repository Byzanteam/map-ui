<template>
  <div
    :style="containerStyle"
    class="container">
    <mgl-map
      :access-token="mapOptions.accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :map-style="mapOptions.style"
      @load="onMapLoaded">
      <cluster
        :map="map"
        :clusterOptions="clusterOptions"
        :mapApi="mapApi"
        @addMarker="addMarkerFunc" />
    </mgl-map>
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
      clusterOptions: PROFILE.parameter.layers.clusters,
    };
  },
  computed: {
    containerStyle () {
      return {
        backgroundImage: `url(${this.mapOptions.background_image})`,
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
    },
  },
};
</script>

<style lang="scss">
  .container {
    background-size: 100% 100%;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    z-index: 1;

    &::before {
      background: #333;
      content: "";
      height: 100%;
      opacity: .3;
      position: absolute;
      width: 100%;
      z-index: 2;
    }
  }

  .mgl-map-wrapper {
    z-index: 4;
  }
</style>

