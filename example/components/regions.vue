<template>
  <base-map
    :map-options="{zoom: 4}"
    features="none"
  >
    <regions
      :groups="groups"
      :areas="areas"
    />
    <label-marker :label-markers="labelMarkers" />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import Regions from '../../src/components/regions.vue';
import LabelMarker from '../../src/components/label_marker.vue';

const AREA_GROUPS = [
  {
    name: '西北',
    codes: [610000, 620000, '630000', 640000, 650000],
    style: {
      fillColor: 'hsl(182, 25%, 50%)',
    },
  },
  {
    name: '华北',
    codes: [110000, 120000, 130000, 140000, 150000],
    style: {
      fillColor: '#000000',
    },
  },
  {
    name: '西南',
    codes: [510000, 500000, 520000, 530000, 540000],
    style: {
      fillColor: 'hsl(160, 100%, 75%)',
    },
  },
  {
    name: '东南',
    codes: [310000, 320000, 330000, 340000, 350000, 360000, 370000],
    style: {
      fillColor: 'hsl(33, 100%, 88%)',
    },
  },
  {
    name: '华中',
    codes: [410000, 420000, 430000],
    style: {
      fillColor: 'hsl(219, 79%, 66%)',
    },
  },
  {
    name: '华南',
    codes: [440000, 450000, 460000],
    style: {
      fillColor: 'hsl(181, 100%, 41%)',
    },
  },
  {
    name: '东北',
    codes: [210000, 220000, 230000],
    style: {
      fillColor: 'hsl(180, 100%, 27%)',
    },
  },
];

const LABEL_DATA = [
  {
    position: ['113.280637', '23.125178'],
    text: '广东',
    style: {
      fontSize: 15,
      fontWeight: 'normal',
      fillColor: 'red',
      strokeColor: '#c67805',
      strokeWidth: 2,
    },
  }, {
    position: ['113.665412', '34.757975'],
    text: '河南',
    style: {
      fontSize: 15,
      fontWeight: 'normal',
      fillColor: 'red',
      strokeColor: '#c67805',
      strokeWidth: 2,
    },
  },
];

export default {
  components: {
    BaseMap,
    Regions,
    LabelMarker,
  },

  data () {
    return {
      areas: [],
    };
  },

  created () {
    this.groups = AREA_GROUPS;
    this.labelMarkers = LABEL_DATA;

    fetch('http://nitrogen.skylarkly.com/geo/100000?district=false', {
      method: 'GET',
      headers: {
        Authorization: 'Token 5e4cdf89bed7d739668292c70f9983ee16c5bdf52a5d1d67',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json()).then((res) => {
      this.areas = res.data.features;
    });
  },
};
</script>
