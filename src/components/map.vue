<template>
  <div class="map">
    <slot />
  </div>
</template>

<script>
import _ from 'lodash';

const { amap } = require('../../config.json');

const { jsApi, mapUi } = amap;
const AVAILABLE_FEATURES = ['bg', 'point', 'road', 'building'];

export const BaseMap = {
  name: 'BaseMap',

  props: {
    features: {
      type: [Array, String],
      default: 'all',
      validator (val) {
        return Array.isArray(val) || _.includes(['all', 'none'], val);
      },
    },
    mapStyle: {
      type: String,
      default: jsApi.style || '',
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

    mapFeatures () {
      let result = [];
      switch (this.features) {
        case 'all': {
          result = AVAILABLE_FEATURES;
          break;
        }
        case 'none': {
          result = [];
          break;
        }
        default: {
          result = this.features;
        }
      }
      return result;
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
    // map api
    setCenter (position) {
      if (this.map) {
        this.map.setCenter(position);
      }
    },

    setZoom (zoom) {
      if (this.map) {
        this.map.setZoom(zoom);
      }
    },

    initialize () {
      this.map = new AMap.Map(this.$el, {
        resizeEnable: true,
        ...this.mapOptions,
        features: this.mapFeatures,
        mapStyle: this.mapStyle,
      });
      this.map.on('moveend', this._resize);
      this.map.on('zoomend', this._resize);
      this.map.on('resize', this._resize);
      // 对外
      this.$emit('map-created', this.map);
      // 对内
      this.excuteCbs('mapCreated', this.map);
      this.map.on('click', e => this.$emit('map-click', e));
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

    _resize: _.debounce(function debounceResize () {
      this.$emit('map-resize', this.map.getBounds());
    }, 100),

    _loadSource () {
      this.__loadMapSource();
    },

    __loadMapSource () {
      if (!this.mapReady) {
        this.__insertScript(
          `https://webapi.amap.com/maps?v=${jsApi.version}&key=${jsApi.key}`,
          () => {
            this.mapReady = true;
          },
        );
      }
    },

    __loadUISource () {
      if (!this.mapUIReady) {
        this.__insertScript(
          `https://webapi.amap.com/ui/1.0/main.js?v=${mapUi.version}`,
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
