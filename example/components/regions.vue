<template>
  <base-map
    :map-options="{viewMode: '3D', zoom: 4}"
    :transparent="true"
  >
    <regions
      :label-data="labelData"
      :custom-area="customArea"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Regions from '../../src/components/regions.vue';

const LABEL_DATA = [
  {
    position: ['113.280637', '23.125178'],
    zooms: [5, 13],
    zIndex: 1,
    opacity: 1,
    text: {
      content: '广东',
      direction: 'center',
      offset: [0, 0],
      zooms: [3, 20],
      style: {
        fontSize: 15,
        fontWeight: 'normal',
        fillColor: '#eee',
        strokeColor: '#c67805',
        strokeWidth: 2,
      },
    },
  }, {
    position: ['113.665412', '34.757975'],
    zooms: [5, 13],
    zIndex: 1,
    opacity: 1,
    text: {
      content: '河南',
      direction: 'center',
      offset: [0, 20],
      zooms: [3, 20],
      style: {
        fontSize: 15,
        fontWeight: 'normal',
        fillColor: '#eee',
        strokeColor: '#c67805',
        strokeWidth: 2,
      },
    },
  },
];
const CUSTOM_AREA = [
  {
    name: '西北',
    codes: ['610000', '620000', '630000', '640000', '650000'],
    options: {
      fillColor: '#000000',
      fillOpacity: 0.7,
    },
  },
  {
    name: '西藏',
    codes: ['540000'],
    options: {
      fillColor: '#ffffff',
      fillOpacity: 0.1,
    },
  },
  {
    name: '华北',
    codes: ['110000', '120000', '130000', '140000', '150000'],
    options: {
      fillColor: '#000000',
      fillOpacity: 0.3,
    },
  },
];

export default {
  components: {
    BaseMap,
    Regions,
  },

  created () {
    this.labelData = LABEL_DATA;
    this.customArea = CUSTOM_AREA;
  },
};
</script>

<style lang="scss">
  // move to reset, then let style be scoped
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
  }
</style>
