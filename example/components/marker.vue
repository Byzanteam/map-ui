<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    use-map-ui
  >
    <base-marker
      :marker="point"
      :inner-label-style="innerLabelStyle"
      :marker-style="markerStyle"
      icon="circle-o"
    />
  </base-map>
</template>

<script>
import BaseMarker from '../../src/components/marker/index';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    BaseMap,
    BaseMarker,
  },

  data () {
    return {
      innerLabelStyle: {
        color: 'red',
        fontSize: 10,
        padding: [10, 0],
        offset: [0, 0],
      },
      markerStyle: {
        color: 'transparent',
        strokeColor: 'red',
        size: 60,
      },
      point: {
        id: 1,
        location: [116.258446, 37.686622],
        value: 0,
        label: '一号点',
      },
    };
  },
};
</script>
