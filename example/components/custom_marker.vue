<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <custom-marker
      :marker="marker"
      :content="markerContent"
      :options="{
        anchor: 'bottom-center'
      }"
    />
  </base-map>
</template>

<script>
import CustomMarker from '../../src/components/marker/custom_marker';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    BaseMap,
    CustomMarker,
  },

  data () {
    return {
      innerLabelStyle: {
        color: 'red',
        fontSize: 10,
        padding: ['10px', 0],
        offset: [0, 0],
      },
      markerStyle: {
        backgroundColor: '',
      },
      marker: {
        id: 1,
        point: [116.258446, 38.986622],
        value: 0,
        label: '一号点',
      },
      markerContent: `
        <img
          style='position: relative;
          width: 48px;
          height: 48px;'
          src='https://slp-qiniu-beta.skylarkly.com/FjVNFXy6c0M_v-17J7of4PsEsbzG'
        >
      `,
    };
  },
};
</script>
