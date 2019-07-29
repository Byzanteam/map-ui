<template>
  <marker-point
    :markers="markers"
    :marker-style-map="markerStyleMap"
    icon="water-droplet"
    @markersRendered="renderCluster"
  />
</template>

<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';
import Icons from './marker/icons.json';
import MarkerPoint from '../../src/components/marker';

const { icons: [{ icons: ICONS }], size: [SIZE] } = Icons;

const DEFAULT_ICON_TYPES = [
  'circle',
  'triangle',
  'triangle-down',
  'hexagon',
  'water-droplet',
  'pentagram',
];

const DEFAULT_CLUSTER_STYLE = {
  color: '#04BF78',
  size: 6,
};

const DEFAULT_BORDER = {
  color: 'rgba(255, 255, 255, 0.2)',
  width: 1,
};

export default {
  name: 'Cluster',

  components: {
    MarkerPoint,
  },

  mixins: [MapMixin],

  props: {
    markers: {
      type: Array,
      default: () => [],
    },
    markerStyleMap: {
      type: Array,
      default: () => [],
    },
    icon: {
      type: String,
      default: 'circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    clusterStyleMap: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    markerBorderStyle () {
      return {
        ...DEFAULT_BORDER,
        ...this.borderStyle,
      };
    },
  },

  methods: {
    renderCluster (markers) {
      this.map.plugin(['AMap.MarkerClusterer'], () => {
        const cluster = new AMap.MarkerClusterer(
          this.map,
          markers,
          {
            gridSize: 80,
            renderClusterMarker: this.getClusterContent,
          }
        );
        cluster.on('click', e => (this.$emit('clusterClick', e)));
      });
    },

    getClusterContent (context) {
      const { count } = context,
            { color, size } = this._getClusterStyle(count);

      const {
        color: borderColor,
        width,
      } = this.markerBorderStyle;

      const clusterSize = size;

      const node = `<div
        style="width: ${clusterSize}px;height: ${clusterSize}px;font-size: 0px;position: relative;">
        ${count}
        <svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" height="100%">
          <path
            stroke-width="${width}px"
            stroke="${borderColor}"
            fill="${color}"
            d="${ICONS[this.icon].paths}"
          />
        </svg>
      </div>`;

      context.marker.setContent(node);
    },

    _getClusterStyle (cluster_count) {
      const currentStyle = _.findLast(
        _.sortBy(this.clusterStyleMap, 'value'),
        ({ count }) => cluster_count >= count
      );
      return currentStyle;
    },
  },
};
</script>
