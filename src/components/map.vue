<template>
  <div class="map">
    <slot />
  </div>
</template>

<script>
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
    useMapUi: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      map: null,
      mapReady: false,
      mapUIReady: false,
      cbs: {
        mapCreated: [],
        sourceReady: [],
      },
    };
  },

  computed: {
    sourceReady () {
      return this.mapReady && (!this.useMapUi || this.mapUIReady);
    },
  },

  provide () {
    return {
      registerCbs: this.registerCbs,
    };
  },

  watch: {
    mapReady (val) {
      if (val) {
        this.$emit('amap-loaded');
        this.initialize();
        if (this.useMapUi) {
          this.__loadUISource();
        }
      }
    },
    mapUIReady (val) {
      if (val) this.$emit('amap-ui-loaded');
    },
    sourceReady (val) {
      if (val) this.excuteCbs('sourceReady');
    },
  },

  mounted () {
    this.mapReady = typeof AMap !== 'undefined';
    this.mapUIReady = typeof AMapUI !== 'undefined';
    this._loadSource();
  },

  methods: {
    initialize () {
      const features = this.transparent ? [] : ['bg', 'road', 'building', 'point'];
      this.map = new AMap.Map(this.$el, {
        ...this.mapOptions,
        features,
        mapStyle: this.mapStyle,
      });
      // 对外
      this.$emit('map-created', this.map);
      // 对内
      this.excuteCbs('mapCreated', this.map);
    },

    registerCbs (type, cb) {
      switch (type) {
        case 'mapCreated': {
          if (this.map) {
            cb(this.map);
          } else {
            this.cbs[type].push(cb);
          }
          break;
        }
        case 'sourceReady': {
          if (this.sourceReady) {
            cb();
          } else {
            this.cbs[type].push(cb);
          }
          break;
        }
        default:
      }
    },

    excuteCbs (type, value) {
      const cbs = this.cbs[type];
      while (cbs.length) {
        const cb = cbs.shift();
        cb(value);
      }
    },

    _loadSource () {
      this.__loadMapSource();
    },

    __loadMapSource () {
      if (!this.mapReady) {
        this.__insertScript(
          `https://webapi.amap.com/maps?v=${amap.version}&key=${amap.key}`,
          () => {
            this.mapReady = true;
          },
        );
      }
    },

    __loadUISource () {
      if (!this.mapUIReady) {
        this.__insertScript(
          'https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',
          () => {
            this.mapUIReady = true;
          },
        );
      }
    },

    __insertScript (src, cb) {
      const script = document.createElement('script');
      script.charset = 'utf-8';
      script.src = src;
      script.onload = () => cb();
      document.head.appendChild(script);
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
