<template>
  <marker-point
    ref="markerPointRef"
    :marker-style-map="markerStyleMap"
    :inner-label-style="innerLabelStyle"
    :icon="icon"
  />
</template>

<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';
import MarkerPoint from './index.vue';

export default {
  components: {
    MarkerPoint,
  },

  mixins: [MapMixin],

  props: {
    markers: {
      type: Array,
      default: () => [],
    },
    zoomStyleMap: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      zoom: 1,
      markerStyleMap: [],
      innerLabelStyle: {},
      icon: 'circle',
    };
  },

  watch: {
    zoom () {
      // 当 zoom 是个确定的数值，匹配的样式只应用当前缩放等级，其他等级marker不显示
      // 当 zoom 是个区间， 匹配的样式应用当前区间等级， 其他等级不显示
      const {
        styleMap,
        innerLabelStyle,
        icon,
      } = this._getZoomMatchStyle(this.zoomStyleMap) || {
        styleMap: [{
          value: _.max(_.map(this.markers, marker => marker.value)),
          color: 'transparent',
        }],
        innerLabelStyle: {},
        icon: 'circle',
      };
      this.markerStyleMap = styleMap;
      this.innerLabelStyle = innerLabelStyle;
      this.icon = icon;
      this.$refs.markerPointRef.setMarkerData(this.markers);
    },
  },

  methods: {
    mapLoadedFunc () {
      this.zoom = this.map.getZoom();
      this.map.on('zoomchange', () => {
        this.zoom = this.map.getZoom();
      });
    },
    _getZoomMatchStyle (configs) {
      return _.findLast(
        _.sortBy(configs, 'zoom'), ({ zoom }) => {
          if (_.isArray(zoom)) {
            return zoom[0] <= this.zoom && this.zoom <= zoom[1];
          }
          return zoom === this.zoom;
        }
      );
    },
  },
};
</script>

<style>

</style>
