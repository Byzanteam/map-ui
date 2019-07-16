<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <markers
      :data="markerData"
      :value-option="{
        marker: valueOption
      }"
      :marker-style="{
        marker: {
          strokeWidth: 0,
        }
      }"
      label-key="description"
    />
  </base-map>
</template>
<script>
import Markers from '../../src/components/marker/marker.vue';
import BaseMap from '../../src/components/map.vue';

export default {
  components: {
    Markers,
    BaseMap,
  },
  data () {
    return {
      markerData: [
        { lnglat: [116.258446, 37.686622], description: '景县', value: 100 },
        { lnglat: [113.559954, 22.124049], description: '圣方济各堂区', value: 200 },
        { lnglat: [116.366794, 39.915309], description: '西城区', value: 300 },
        { lnglat: [116.486409, 39.921489], description: '朝阳区', value: 400 },
        { lnglat: [116.286968, 39.863642], description: '丰台区', value: 500 },
      ],
      valueOption: [
        { value: 500, style: { fill: 'red' } },
        { value: 200, style: { fill: '#d9ff5d' } },
        { value: 300, style: { fill: '#d94f5d' } },
        { value: 100, style: { fill: '#fff' } },
      ],
    };
  },
};
</script>
