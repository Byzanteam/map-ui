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
      <markers :markerOptions="markerOptions" />
      <cluster
        :map="map"
        :cluster-options="clusterOptions"
        :map-api="mapApi"
        @addMarker="addMarkerFunc" />
      <regions-box
        :regions-options="regionsOptions"
        :map-api="mapApi" />
    </mgl-map>
  </div>
</template>

<script>
import { MglMap } from 'vue-mapbox';
import Markers from './markers.vue';
import RegionsBox from './regions_box.vue';
import Cluster from './cluster.vue';
import PROFILE from '../resources/profile';

export default {
  name: 'BaseMap',
  components: {
    MglMap,
    Markers,
    Cluster,
    RegionsBox,
  },
  data () {
    return {
      map: null,
      mapOptions: PROFILE.parameter,
      markerOptions: PROFILE.parameter.layers.marker,
      clusterOptions: PROFILE.parameter.layers.clusters,
      regionsOptions: PROFILE.parameter.layers.regions,
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
    addMarkerFunc (marker) {
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

