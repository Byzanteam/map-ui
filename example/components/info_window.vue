<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    use-map-ui
    @map-click="test"
  >
    <base-marker
      :marker="point"
      :inner-label-style="innerLabelStyle"
      :marker-style="markerStyle"
      icon="circle-o"
    />
    <info-window
      ref="windowRef"
      :options="{closeWhenClickMap: true}"
      @infowindow-ready="createWindow"
    />
  </base-map>
</template>

<script>
import BaseMarker from '../../src/components/marker/index';
import BaseMap from '../../src/components/map.vue';
import infoWindow from '../../src/components/info_window.vue';

export default {
  components: {
    BaseMap,
    BaseMarker,
    infoWindow,
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

  methods: {
    createWindow () {
      this.$refs.windowRef.createInfoWindow(
        {
          content: '<div>1233</div>',
          location: [116.258446, 37.686622],
        }
      );
    },
    test () {
      console.log(this.$refs.windowRef.infoWindow.getIsOpen());
    },
  },
};
</script>
