<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    use-map-ui
  >
    <base-marker
      v-for="(marker, index) in markers"
      :key="index"
      :marker="marker.marker"
      :inner-label-style="marker.innerLabelStyle"
      :marker-style="marker.markerStyle"
      icon="circle-o"
      @marker-clicked="markerClickFunc"
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
      points: [
        {
          id: 3,
          location: [118.058446, 24.686622],
          value: 0,
          label: '三号点',
        },
      ],
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
      selectedMarkerStyle: {
        color: 'blue',
        strokeColor: 'red',
        size: 60,
      },
      selectedInnerLabelStyle: {
        color: '#ffffff',
        fontSize: 16,
        padding: [10, 0],
        offset: [0, 0],
      },
      selected: null,
    };
  },

  computed: {
    markers () {
      const a = this.points.map((point) => {
        if (this.selected === point.id) {
          return {
            marker: point,
            markerStyle: this.selectedMarkerStyle,
            innerLabelStyle: this.selectedInnerLabelStyle,
          };
        }
        return {
          marker: point,
          markerStyle: this.markerStyle,
          innerLabelStyle: this.innerLabelStyle,
        };
      });
      return a;
    },
  },

  methods: {
    markerClickFunc (e) {
      if (this.selected === e.target.getExtData().id) {
        this.selected = '';
      } else {
        this.selected = e.target.getExtData().id;
      }
    },
  },
};
</script>
