<template>
  <div
    :style="containerStyle"
    class="container">
    <mgl-map
      :access-token="mapOptions.accessToken"
      :zoom="mapOptions.zoom"
      :center="mapOptions.center"
      :map-style="mapOptions.style"
      @load="onMapLoaded" />
      <regionsBox
        :regionsOptions="regionsOptions"
        :mapOn="mapOn"
        :mapGetSource="getSource"
        :mapAddSource="addSource" />
    </mgl-map>
  </div>
</template>

<script>
import { MglMap } from 'vue-mapbox';
import RegionsBox from './regions_box.vue';
import PROFILE from '../resources/profile';

export default {
  name: 'BaseMap',
  components: {
    MglMap,
    RegionsBox,
  },
  data () {
    return {
      map: null,
      mapOptions: PROFILE.parameter,
      regionsOptions: PROFILE.parameter.layers.regions,
    };
  },
  computed: {
    containerStyle () {
      return {
        backgroundImage: `url(${this.mapOptions.background})`,
      };
    },
  },
  methods: {
    onMapLoaded (event) {
      this.map = event.map;
    },
    mapOn (event, layer_id, func) {
      this.map.on(event, layer_id, func);
    },
    getSource (id) {
      this.map.getSource(id);
    },
    addSource (id, options) {
      this.map.addSource(id, options);
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

