<template>
  <div class="map">
    <div class="map-container" />
    <slot />
  </div>
</template>

<script>
import _ from 'lodash';

// move key to config
const KEY = 'd1d5c1dd836024b07017d5c639705937';

export const Map = {
  name: 'Map',

  props: {
    transparent: {
      type: Boolean,
      default: false,
    },
    mapStyle: {
      type: String,
      default: '',
    },
    version: {
      type: String,
      default: '1.4.15',
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
        zoom: '12',
        features,
        mapStyle: this.mapStyle,
      });
    },

    _loadSource () {
      if ((typeof AMap) === 'undefined') {
        const script = document.createElement('script');
        script.charset = 'utf-8';
        script.src = `https://webapi.amap.com/maps?v=${this.version}&key=${KEY}`;
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

export default Map;
</script>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
