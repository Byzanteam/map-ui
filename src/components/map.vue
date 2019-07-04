<template>
  <div class="map">
    <div class="map-container" />
    <slot />
  </div>
</template>

<script>
// move key to config
const { amap } = require('../../config.json');

export const BaseMap = {
  name: 'BaseMap',

  props: {
    transparent: {
      type: Boolean,
      default: false,
    },
    mapStyle: {
      type: String,
      default: '',
    },
  },

  provide () {
    return {
      instance: this.instance,
    };
  },

  data () {
    return {
      instance: {
        map: null,
      },
    };
  },

  created () {
    this._loadSource();
  },

  methods: {
    initialize () {
      const features = this.transparent ? [] : ['bg', 'road', 'building', 'point'];
      this.instance.map = new AMap.Map(this.$el, {
        zoom: 12,
        features,
        mapStyle: this.mapStyle,
      });
    },

    _loadSource () {
      if ((typeof AMap) === 'undefined') {
        const script = document.createElement('script');
        script.charset = 'utf-8';
        script.src = `https://webapi.amap.com/maps?v=${amap.version}&key=${amap.key}`;
        script.onload = () => {
          this.$emit('AMapLoaded');
          this.initialize();
        };
        document.head.appendChild(script);
      } else {
        this.initialize();
      }
    },
  },
};

export default BaseMap;
</script>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
