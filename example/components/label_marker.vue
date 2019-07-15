<template>
  <base-map
    :map-options="{zoom: 4}"
    transparent
  >
    <label-marker :label-markers="labelMarker" />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import LabelMarker from '../../src/components/label_marker.vue';

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

export default {
  components: {
    BaseMap,
    LabelMarker,
  },

  data () {
    return {
      labelMarker: [],
    };
  },

  created () {
    this.labelMarker = LABEL_DATA;
  },
};
</script>
