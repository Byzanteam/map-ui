<template>
  <div>
    <MglMarker
      :coordinates="marker.geometry.coordinates">
      <div slot="marker" v-bindEvents="index">
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
        <label
          :style="{ fontSize: markerStyle.fontSize }"
          class="marker-text">
          {{ marker.properties.message }}
        </label>
      </div>
      <MglPopup
        :closeButton="false"
        :showed="popupShowed[index]"
        :offset="popupOffset">
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
    marker:  {
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
      markerStyle: this.markerOptions.style,
      events: this.markerOptions.events,
      popupOffset: [],
      currentMarkerIndex: -1,
      popupShowed: [],
    }
  },
  directives: {
    bindEvents: {
      inserted: function(el, binding, vnode) {
        let vm = vnode.context;
        _.forOwn(vm.events, function(func, event) {
          el.addEventListener(event, function(){
            if(vm[func]) {
              vm[func](binding.value);
            }
          });
        });
      },
      unbind: function(el, binding, vnode) {
        let vm = vnode.context;
        _.forOwn(vm.events, function(func, event) {
          el.removeEventListener(event, function(){
            if(vm[func]) {
              vm[func](binding.value);
            }
          });
        });
      }
    }
  },
  mounted () {
    this.getPopupOffset();
    this.popupShowed = new Array(this.markers.length).fill(false);
  },
  methods: {
    getPopupOffset () {
      if(this.markerStyle.fontSize) {
        this.popupOffset = [0, -this.markerStyle.fontSize/2]
      } else {
        this.popupOffset = [0, -this.$refs.markerTextRef[0].offsetHeight/2]
      }
    },
    popupOpen (value) {
      this.currentMarkerIndex = value;
      this.popupShowed.splice(this.currentMarkerIndex, 1, true);
    },
    popupClose () {
      this.currentMarkerShowed = true;
      this.popupShowed.splice(this.currentMarkerIndex, 1, false);
    }
  }
}
</script>

<style>
  .mapboxgl-marker {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  .marker-text {
    line-height: 1;
  }
  .icon-image {
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    z-index: 0;
  }
</style>
