<template>
  <base-map
    ref="map"
    :map-options="{
      viewMode: '3D',
      pitch: 60,
      zoom: 14,
      center: [104.049835, 30.566256],
      resizeEnable: true,
      showIndoorMap: false,
      showBuildingBlock:false,
    }"
    map-style="amap://styles/b71b42b9bcd91bf21d3dee1ed11ceee5"
    :use-map-ui="true"
    @mouse-moving="stopRotate"
  >
    <regions
      ref="outlineRegion"
      :z-index="0"
      :bubble="true"
      :areas="communityRegion.features"
      :area-style="communityAreaStyle"
      :area-hover-style="communityAreaHoverStyle"
      @area-clicked="areaClicked"
    />
    <object3-d
      :model-source-path="modelPath"
      :light-option="lightOption"
      :model-option="modelOption"
      @modelClick="modelClick"
    />
    <marker-point
      v-for="(marker, index) in markers"
      :key="index"
      :marker="marker"
      :marker-style="markerStyle"
      @marker-clicked="createWindow(marker)"
    />
    <info-window
      ref="windowRef"
      :info-window-options="{closeWhenClickMap: true}"
      :location="infoData.location"
      :info-window-html="infoData.content"
    />
  </base-map>
</template>

<script>
import gcoord from 'gcoord';
import BaseMap from '../../src/components/map.vue';
import Object3D from '../../src/components/object3D';
import Regions from '../../src/components/regions';
import MarkerPoint from '../../src/components/marker/index';
import infoWindow from '../../src/components/info_window.vue';
import guixiGeojson from '../../public/test/geojson/guixi_map.json';
import communityRegion from '../../public/test/geojson/guixi_community.json';

export default {
  components: {
    BaseMap,
    Object3D,
    Regions,
    MarkerPoint,
    infoWindow,
  },

  data () {
    return {
      guixiGeojson: gcoord.transform(
        guixiGeojson, gcoord.WGS84, gcoord.GCJ02
      ), // 地图geoJson偏离修正
      communityRegion: gcoord.transform(
        communityRegion, gcoord.WGS84, gcoord.GCJ02
      ), // 同上
      outlineAreaStyle: {
        strokeColor: '#3BF1C7', strokeStyle: 'dashed', fillColor: '#32c5ff', fillOpacity: 0.2, strokeWeight: 3,
      },
      outlineAreaHoverStyle: {
        strokeColor: '#3BF1C7', fillOpacity: 0.2, strokeWeight: 3,
      },
      communityAreaStyle: {
        strokeColor: '#30b699', fillColor: '#32c5ff', fillOpacity: 0.1, strokeWeight: 2,
      },
      communityAreaHoverStyle: {
        strokeColor: '#30b699', fillColor: '#32c5ff', fillOpacity: 0, strokeWeight: 2,
      },
      modelPath: ['test/only-guixi.gltf'],
      lightOption: {
        ambientLight: [[1, 1, 1], 1],
        directionLight: [[1, -1, 5], [1, 1, 1], 1],
      },
      modelOption: [{
        position: [104.04969, 30.566186],
        scale: 7.75,
        height: 10,
        scene: 0,
      }],
      mouseOnMove: false,
      mousePosition: {
        x: 0,
        y: 0,
      },
      timer: null,
      markers: [
        { location: [104.049835, 30.566256], label: '一号点', content: '<div>123</div>' },
        { location: [104.029835, 30.566256], label: '二号点', content: '<div>456</div>' },
      ],
      markerStyle: {
        color: 'transparent',
        strokeColor: 'red',
        size: 30,
      },
      infoData: {},
    };
  },

  watch: {
    mouseOnMove (value) {
      if (value && this.timer) {
        clearInterval(this.timer);
      } else {
        this.rotate();
      }
    },
  },

  created () {
    this.rotate();
    this.infoData = this.markers;
  },

  methods: {
    modelClick (index, object, point, distance) {
      console.log(index, object, point, distance);
    },
    areaClicked (geoJSON, area) {
      this.$refs.map.map.setCenter([104.07860861130011, 30.57640644162895]);
      console.log('区域点击', geoJSON, area);
    },
    rotate () {
      this.timer = setInterval(() => {
        this.$refs.map.map.setRotation(
          (this.$refs.map.map.getRotation() + 0.1) % 360
        );
      }, 100);
    },
    stopRotate (e) {
      this.modelOption.x = e.pixel.x;
      this.modelOption.y = e.pixel.y;
      this.mouseOnMove = true;
      setTimeout(() => {
        if (this.modelOption.x === e.pixel.x
          && this.modelOption.y === e.pixel.y) {
          this.mouseOnMove = false;
        }
      }, 3000);
    },
    createWindow (info) {
      this.infoData = info;
      this.$refs.windowRef.open();
    },
  },
};
</script>
