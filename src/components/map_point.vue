<template>
  <div />
</template>
<script>
import _ from 'lodash';

const defaultMarker = {
  radius: 20,
  strokeColor: '#767676',
  strokeWeight: 2,
  fillColor: '#4e6398',
};

export const MapPoint = {
  props: {
    datas: {
      type: Array,
      default: () => [],
    },
    marker: {
      type: Object,
      default: () => ({}),
    },
    cluster: {
      type: Boolean,
      default: true,
    },
    positionKey: {
      type: String,
      default: 'lnglat',
    },
    descriptionKey: {
      type: String,
      default: 'description',
    },
  },

  inject: ['instance'],

  data () {
    return {
      markers: [],
    };
  },

  computed: {
    map () {
      return this.instance.map;
    },

    markerResult () {
      return _.assign({}, defaultMarker, this.marker);
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

      map.plugin(['AMap.MarkerClusterer'], () => new AMap.MarkerClusterer(map, this.markers, { styles }));
    },

    generateMakers () {
      this.markers = this.datas.map((itme) => {
        const marker = new AMap.Marker({
          position: itme[this.positionKey],
          content: this.getGraphics(),
          anchor: 'bottom-center',
        });
        marker.on('mouseout', this.hiddenInfo);
        marker.on('mouseover', this.showInfo);
        return marker;
      });
    },

    buildMakers (map) {
      _(this.markers).forEach((value) => {
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
      e.target.setLabel({
        offset: new AMap.Pixel(0, -this.markerResult.radius),
        content: '我是 marker 的 label 标签',
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
