<template>
  <div />
</template>
<script>
import _ from 'lodash';

const DEFAULT_MAERKER = {
  radius: 20,
  strokeColor: '#767676',
  strokeWeight: 2,
  fillColor: '#4e6398',
};

export const MapPoint = {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    cluster: {
      type: Boolean,
      default: true,
    },
    descriptionKey: {
      type: String,
      default: 'description',
    },
  },

  inject: ['instance'],

  data () {
    return {
      generateMarkers: [],
    };
  },

  computed: {
    map () {
      return this.instance.map;
    },

    markerResult () {
      return {
        ...DEFAULT_MAERKER,
        ...this.markerStyle,
      };
    },
  },

  watch: {
    map (newValue, oldValue) {
      if (newValue && _.isEqual(newValue, oldValue)) return;
      this.initMakers(newValue);
    },
  },

  methods: {
    initMakers (map) {
      this.generateMakers();

      if (this.cluster) {
        this.buildClusterMakers(map);
      } else {
        this.buildMakers(map);
      }
    },

    buildClusterMakers (map) {
      const styles = [{
        url: 'https://a.amap.com/jsapi_demos/static/images/blue.png',
        size: new AMap.Size(32, 32),
        offset: new AMap.Pixel(-16, -16),
      }];

      map.plugin(['AMap.MarkerClusterer'], () => new AMap.MarkerClusterer(map, this.generateMarkers, { styles }));
    },

    generateMakers () {
      this.generateMarkers = this.data.map((itme) => {
        const marker = new AMap.Marker({
          position: itme.lnglat,
          content: this.getGraphics(),
          anchor: 'bottom-center',
          extData: itme,
          offset: new AMap.Pixel(0, 0),
        });
        marker.on('mouseout', this.hiddenInfo);
        marker.on('mouseover', this.showInfo);
        return marker;
      });
    },

    buildMakers (map) {
      _(this.generateMarkers).forEach((value) => {
        value.setMap(map);
      });
    },

    getGraphics (type) {
      const {
        fillColor,
        radius,
        strokeWeight,
        strokeColor,
      } = this.markerResult;

      switch (type) {
        default:
          return `<div style="
            background-color: ${fillColor};
            height: ${radius}px;
            width: ${radius}px;
            border: ${strokeWeight}px solid ${strokeColor};
            border-radius: ${radius}px;"></div>`;
      }
    },

    showInfo (e) {
      const { target } = e;
      target.setLabel({
        offset: new AMap.Pixel(0, -this.markerResult.radius),
        content: target.B.extData[this.descriptionKey],
        direction: 'center',
      });
    },

    hiddenInfo (e) {
      e.target.setLabel({
        content: '',
      });
    },
  },
};

export default MapPoint;
</script>
