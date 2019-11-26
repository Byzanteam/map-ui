<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <mass-marker
      ref="markerRef"
      :markers="pointData"
      :styles="massMarkerStyles"
    />
  </base-map>
</template>

<script>
import MassMarker from '../../src/components/marker/mass_marker';
import BaseMap from '../../src/components/map.vue';

import cities from './cities';

export default {
  components: {
    MassMarker,
    BaseMap,
  },

  data () {
    return {
      pointData: [],
      massMarkerStyles: [],
    };
  },

  mounted () {
    this.pointData = [];
  },

  methods: {
    markerClickedFunc () {
      this.pointData = [
        {
          lnglat: [
            113.571709,
            34.790046,
          ],
          单位详细名称: '郑州恒天润滑油有限公司',
          style: 18,
        },
        {
          lnglat: [
            113.598988,
            34.794844,
          ],
          单位详细名称: '河南敷灵药业有限公司',
          style: 5,
        },
        {
          lnglat: [
            113.578518,
            34.783121,
          ],
          单位详细名称: '郑州鼎鼎包装有限公司',
          style: 9,
        },
      ];
      this.massMarkerStyles = [
        {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
          anchor: [6, 6],
          size: [11, 11],
        },
        {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
          anchor: [4, 4],
          size: [7, 7],
        },
      ];
    },
  },
};
</script>
