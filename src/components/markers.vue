<template>
  <div>
    <MglMarker
      v-for="(marker, index) in markers"
      :key="index"
      :coordinates="marker.geometry.coordinates">
      <div slot="marker" v-bindEvents="marker.geometry.coordinates">
        <component
          :is="markerStyle.animation"
          :color="markerStyle.color"
          :size="markerStyle.size">
          <v-icon
            class="icon-image"
            slot="svg-icon"
            :size="markerStyle.size"
            :color="markerStyle.color">
          </v-icon>
        </component>
        <label class="marker-text" :style="{ fontSize: markerStyle.fontSize }" ref="markerTextRef">
          {{ marker.properties.message }}
        </label>
      </div>
      <MglPopup :closeButton="false" :offset="popupOffset">
        <div>{{ marker.properties.message }}</div>
      </MglPopup>
    </MglMarker>
  </div>
</template>

<script>
import { MglMarker, MglPopup } from "vue-mapbox";
import Icon from "./icon.vue"

export default {
  components: {
    MglMarker,
    MglPopup,
    "v-icon": Icon
  },
  props: {
    map: {
      type: Object,
      default () {
        return {};
      },
    },
    markerOptions: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      markers: this.markerOptions.data,
      markerStyle: this.markerOptions.style,
      animationType: "",
      events: this.markerOptions.events,
      popupOffset: [],
    }
  },
  directives: {
    bindEvents: {
      inserted: function(el, binding, vnode) {
        let vm = vnode.context;
        _.forOwn(vm.events, function(func, event) {
          el.addEventListener(event, function(){
            vm[func](binding.value)
          });
        });
      }
    }
  },
  mounted () {
    this.getPopupOffset();
  },
  methods: {
    getPopupOffset () {
      if(this.markerStyle.fontSize) {
        this.popupOffset = [0, -this.markerStyle.fontSize/2]
      } else {
        this.popupOffset = [0, -this.$refs.markerTextRef[0].offsetHeight/2]
      }
    },
    test (value) {
      console.log(value)
    }
  }
}
</script>

<style>
  .mapboxgl-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .marker-text {
    line-height: 1;
  }
  .icon-image {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    z-index: 0;
  }
</style>
