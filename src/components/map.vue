<template>
  <div class="map">
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
      default: amap.style || '',
    },
    mapOptions: {
      type: Object,
      default () {
        return {};
      },
    },
    useAMapUI: {
      type: Boolean,
      default: false,
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

  mounted () {
    this._loadSource();
  },

  methods: {
    initialize () {
      const features = this.transparent ? [] : ['bg', 'road', 'building', 'point'];
      this.instance.map = new AMap.Map(this.$el, {
        ...this.mapOptions,
        features,
        mapStyle: this.mapStyle,
      });
    },

    _loadSource () {
      this.__loadMapSource();
      if (this.useAMapUI) {
        this.__loadUISource();
      }
    },

    __loadMapSource () {
      if (typeof AMap === 'undefined') {
        this.__insertScript(
          `https://webapi.amap.com/maps?v=${amap.version}&key=${amap.key}`,
          () => {
            this.$emit('AMapLoaded');
            this.initialize();
          },
        );
      } else {
        this.initialize();
      }
    },

    __loadUISource () {
      if (typeof AMapUI === 'undefined') {
        this.__insertScript(
          'https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',
          () => {
            this.$emit('AMapUILoaded');
          },
        );
      }
    },

    __insertScript (src, cb) {
      const script = document.createElement('script');
      script.charset = 'utf-8';
      script.src = src;
      script.onload = () => {
        cb();
      };
      document.head.appendChild(script);
    }
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
