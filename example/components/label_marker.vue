<template>
  <base-map
    :map-options="{zoom: 4}"
    :map-js-api-version="'1.4.15'"
    :map-ui-version="'1.0.11'"
    features="none"
  >
    <label-marker :label-markers="labelMarkers" />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import LabelMarker from '../../src/components/label_marker.vue';

const LABEL_DATA = [
  {
    position: ['113.280637', '23.125178'],
    text: '广东',
    style: {
      fontSize: 15,
      fontWeight: 'normal',
      fillColor: '#eee',
      strokeColor: '#c67805',
      strokeWidth: 2,
    },
  }, {
    position: ['113.665412', '34.757975'],
    text: '河南',
    style: {
      fontSize: 15,
      fontWeight: 'normal',
      fillColor: '#eee',
      strokeColor: '#c67805',
      strokeWidth: 2,
    },
  },
];

export default {
  components: {
    BaseMap,
    LabelMarker,
  },

  created () {
    this.labelMarkers = LABEL_DATA;
  },
};
</script>
