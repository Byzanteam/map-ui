<template>
  <base-map
    :map-options="{zoom: 4}"
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
      fillColor: 'hsl(182, 25%, 50%)',
      fillOpacity: 0.7,
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
  {
    name: '西南',
    codes: ['510000', '500000', '520000', '530000', '540000'],
    style: {
      fillColor: 'hsl(160, 100%, 75%)',
    },
  },
  {
    name: '东南',
    codes: ['310000', '320000', '330000', '340000', '350000', '360000', '370000'],
    style: {
      fillColor: 'hsl(33, 100%, 88%)',
    },
  },
  {
    name: '华中',
    codes: ['410000', '420000', '430000', '440000', '450000', '460000'],
    style: {
      fillColor: 'hsl(219, 79%, 66%)',
    },
  },
  {
    name: '东北',
    codes: ['210000', '220000', '230000'],
    style: {
      fillColor: 'hsl(180, 100%, 27%)',
      fillOpacity: .3,
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
