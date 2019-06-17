<template>
  <mgl-marker :coordinates="marker.geometry.coordinates">
    <div slot="marker" v-bindEvents>
      <component
        :is="markerStyle.animation"
        :color="markerStyle.color"
        :size="markerStyle.size">
        <icon
          slot="svg-icon"
          :size="markerStyle.size"
          :color="markerStyle.color"
          class="icon-image">
        </icon>
      </component>
      <label
        ref="markerTextRef"
        :style="{ fontSize: markerStyle.fontSize }"
        class="marker-text">
        {{ marker.properties.message }}
      </label>
    </div>
    <mgl-popup
      :closeButton="false"
      :showed="popupShowed"
      :offset="popupOffset">
      <div>{{ marker.properties.message }}</div>
    </mgl-popup>
  </mgl-marker>
</template>

<script>
import { MglMarker, MglPopup } from 'vue-mapbox';
import _ from 'lodash';
import Icon from './icon.vue';

export default {
  components: {
    MglMarker,
    MglPopup,
    Icon,
  },
  props: {
    marker:  {
      type: Object,
      default () {
        return {};
      },
    },
    markerStyle: {
      type: Object,
      default () {
        return {};
      },
    },
    events: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      popupOffset: [],
      popupShowed: false,
    };
  },
  directives: {
    bindEvents: {
      inserted: function(el, binding, vnode) {
        let vm = vnode.context;
        _.forOwn(vm.events, function(func, event) {
          el.addEventListener(event, function() {
            if(vm[func]) {
              vm[func]();
            }
          });
        });
      },
    },
  },
  mounted () {
    this.getPopupOffset();
  },
  methods: {
    getPopupOffset () {
      this.popupOffset = [0, -this.$refs.markerTextRef.offsetHeight/2];
    },
    popupOpen () {
      this.popupShowed = true;
    },
    popupClose () {
      this.popupShowed = false;
    },
  },
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
