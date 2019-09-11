<template>
  <base-map
    :map-options="{
      zoom: 5
    }"
    use-map-ui
  >
    <svg-marker
      :markers="pointData"
      icon="Triangle"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import SvgMarker from '../../src/components/marker/svg_marker';

const MARKERS = [
  {
    id: 1,
    location: [116.258446, 38.686622],
    value: 0,
    label: '一号点',
  },
  {
    id: 2,
    location: [113.559954, 23.124049],
    value: 1.5,
  },
  {
    id: 3,
    location: [116.366794, 40.915309],
    value: 2,
    label: '三号点',
  },
  {
    id: 4,
    location: [116.886409, 39.921489],
    value: 2,
    label: '四号点',
  },
  {
    id: 5,
    location: [116.286968, 39.863642],
    value: 5,
    label: '五号点',
  },
];

export default {
  components: {
    BaseMap,
    SvgMarker,
  },

  data () {
    return {
      pointData: MARKERS,
      markerStyle: {
        shape: 'WaterDrop',
      },
    };
  },
};
</script>
