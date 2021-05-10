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
    <path-replay
      v-for="(item, index) in path"
      :key="index+item.path"
      ref="path"
      :path="item.path"
      :speed="item.speed"
      :start-time="item.startTime"
      :marker="marker"
      :content="markerContent"
      :options="{
        autoRotation: true,
        angle:-90,
      }"
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
import infoWindow from '../../src/components/info_window.vue';
import PathReplay from '../../src/components/pathReplay';
import guixiGeojson from '../../public/test/geojson/guixi_map.json';
import communityRegion from '../../public/test/geojson/guixi_community.json';

export default {
  components: {
    BaseMap,
    Object3D,
    Regions,
    infoWindow,
    PathReplay,
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
      infoData: {},
      path: [
        {
          // eslint-disable-next-line max-len
          path: [[104.069735,30.532125],[104.069671,30.535516],[104.06944,30.542345],[104.069317,30.546864],[104.069317,30.546864],[104.068861,30.560418],[104.0687,30.565691],[104.068513,30.572069],[104.068438,30.57569],[104.068352,30.578983],[104.068134,30.585938],[104.068053,30.588788],[104.067731,30.59807],[104.067415,30.608657]],
          speed: 4800,
          startTime: 0,
        },
        {
          // eslint-disable-next-line max-len
          path: [[104.069735,30.532125], [104.067415, 30.608657]],
          speed: 4800,
          startTime: 1000,
        },
        {
          // eslint-disable-next-line max-len
          path: [[104.069735,30.532125], [104.067415, 30.608657]],
          speed: 4800,
          startTime: 2000,
        },
        {
          // eslint-disable-next-line max-len
          path: [[104.069735,30.532125], [104.067415,30.608657]],
          speed: 4800,
          startTime: 3000,
        },

        {
          // eslint-disable-next-line max-len
          path: [[104.067415,30.608657],[104.067529,30.598062],[104.067786,30.588785],[104.067867,30.585926],[104.068092,30.578957],[104.068205,30.575692],[104.068205,30.575692],[104.0685,30.565679],[104.068672,30.560413],[104.068913,30.551391],[104.069058,30.546868],[104.069176,30.54234],[104.06938,30.535539],[104.069488,30.532125]],
          speed: 4800,
          startTime: 1000,
        },
        {
          // eslint-disable-next-line max-len
          path: [[104.067415, 30.608657], [104.069488, 30.532125]],
          speed: 4800,
          startTime: 2000,
        },
        {
          // eslint-disable-next-line max-len
          path: [[104.067415, 30.608657], [104.069488, 30.532125]],
          speed: 4800,
          startTime: 3000,
        },
        {
          // eslint-disable-next-line max-len
          path: [[104.067415, 30.608657], [104.069488, 30.532125]],
          speed: 4800,
          startTime: 4000,
        },
      ],
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
        point: [0, 0],
        // value: 0,
        // label: '一号点',
      },
      markerContent: `
        <div
          class="marker-point"
        />
      `,
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
      // this.timer = setInterval(() => {
      //   this.$refs.map.map.setRotation(
      //     (this.$refs.map.map.getRotation() + 0.025) % 360
      //   );
      // }, 100);
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

<style>
.marker-point {
  position: relative;
  width: 31px;
  height: 3px;
  background-image: url("../../public/test/markpoint.png");
  background-size: 100% 100%;
}
</style>
