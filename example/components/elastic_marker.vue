<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
  >
    <elastic-marker
      :markers="pointData"
      :zoom-style-map="zoomStyleMap"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import ElasticMarker from '../../src/components/marker/elastic_marker.vue';

const MARKERS = [
  {
    id: 1,
    location: [116.258446, 37.686622],
    value: 0,
    label: '一号点',
  },
  {
    id: 2,
    location: [113.559954, 22.124049],
    value: 1.5,
  },
  {
    id: 3,
    location: [116.366794, 39.915309],
    value: 2,
    label: '三号点',
  },
  {
    id: 4,
    location: [116.486409, 39.921489],
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
    ElasticMarker,
  },

  data () {
    return {
      pointData: MARKERS,
      zoomStyleMap: [
        {
          zoom: 5,
          styleMap: [
            { value: 1, color: 'green' },
            { value: 2, color: 'red' },
            { value: 4, color: 'blue' },
          ],
          innerLabelStyle: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.2)',
            fontWeight: 400,
          },
          icon: 'circle',
        },
        {
          zoom: 7,
          styleMap: [
            { value: 0, color: 'purple' },
            { value: 2, color: 'yellow' },
            { value: 4, color: 'blue' },
          ],
          innerLabelStyle: {
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.2)',
            fontWeight: 400,
          },
          icon: 'triangle',
        },
        {
          zoom: [8, 10],
          styleMap: [
            { value: 0, color: 'cadetblue' },
            { value: 2, color: 'crimson' },
            { value: 4, color: 'chocolate' },
          ],
          innerLabelStyle: {
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.2)',
            fontWeight: 400,
          },
          icon: 'hexagon',
        },
      ],
    };
  },
};
</script>
