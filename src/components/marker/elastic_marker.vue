<template>
  <marker-point
    ref="markerPointRef"
    :markers="markers"
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
      innerLabelStyle: null,
      icon: null,
    };
  },

  computed: {
    hiddenStyle () {
      return {
        styleMap: [{
          value: _.max(_.map(this.markers, marker => marker.value)),
          color: 'transparent',
        }],
        innerLabelStyle: {},
        icon: 'Circle',
      };
    },
  },

  watch: {
    zoom () {
      // 当 zoom 是个确定的数值，匹配的样式只应用当前缩放等级，其他等级marker不显示
      // 当 zoom 是个区间， 匹配的样式应用当前区间等级， 其他等级不显示
      const {
        styleMap,
        innerLabelStyle,
        icon,
      } = this._getZoomMatchStyle(this.zoomStyleMap) || this.hiddenStyle;
      this.markerStyleMap = styleMap;
      this.innerLabelStyle = innerLabelStyle;
      this.icon = icon;
    },
  },

  methods: {
    mapLoadedFunc () {
      this.changeZoom();
      this.map.on('zoomchange', () => {
        this.changeZoom();
      });
    },
    changeZoom () {
      this.zoom = this.map.getZoom();
    },
    _getZoomMatchStyle () {
      return _.findLast(_.sortBy(this.zoomStyleMap, 'zoom'), ({ zoom }) => {
        if (_.isArray(zoom)) {
          return zoom[0] <= this.zoom && this.zoom <= zoom[1];
        }
        return zoom === this.zoom;
      });
    },
  },
};
</script>
