<template>
  <base-map
    :map-options="{viewMode: '3D', zoom: 4}"
    transparent
  >
    <regions
      :label-data="labelData"
      :groups="groups"
      :areas="areas"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Regions from '../../src/components/regions.vue';
import geojson from './geojson.json';

const LABEL_DATA = [
  {
    position: ['113.280637', '23.125178'],
    text: {
      content: '广东',
      direction: 'center',
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
    text: {
      content: '河南',
      direction: 'center',
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
const AREA_GROUPS = [
  {
    name: '西北',
    codes: ['610000', '620000', '630000', '640000', '650000'],
    style: {
      fillColor: '#000000',
      fillOpacity: 0.7,
    },
  },
  {
    name: '西藏',
    codes: ['540000'],
    style: {
      fillColor: 'gray',
      fillOpacity: 0.1,
    },
  },
  {
    name: '华北',
    codes: ['110000', '120000', '130000', '140000', '150000'],
    style: {
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
    this.groups = AREA_GROUPS;
    this.areas = geojson.features;
  },
};
</script>
