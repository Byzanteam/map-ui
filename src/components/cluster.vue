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

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
};

const DEFAULT_BORDER = {
  color: 'rgba(255, 255, 255, 0.2)',
  width: 1,
};

const INNER_LABERL_FIXED_STYLE = `
  position: absolute;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
  width: 100%;
  text-align: center;
`;

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
    clusterKey: {
      type: String,
      default: '',
    },
  },

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_CLUSTER_STYLE,
        ...this.markerStyle,
      };
    },
    markerBorderStyle () {
      return {
        ...DEFAULT_BORDER,
        ...this.borderStyle,
      };
    },
    clusterInnerLabelStyle () {
      return {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...this.innerLabelStyle,
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
      const { label, currentStyle } = this._getClusterLabelAndStyle(context);
      const { color, size, type } = currentStyle;

      const { fontSize } = this.clusterInnerLabelStyle,
            clusterSize = fontSize + (size * 2),
            icon = type || this.icon;

      const node = `<div
        style="width: ${clusterSize}px;height: ${clusterSize}px;font-size: 0px;position: relative;">
        ${label}
        <svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" height="100%">
          <path
            stroke-width="${this.markerBorderStyle.width}px"
            stroke="${this.markerBorderStyle.color}"
            fill="${color}"
            d="${ICONS[icon].paths}"
          />
        </svg>
      </div>`;

      context.marker.setContent(node);
    },

    _getClusterLabelAndStyle (context) {
      let currentStyle,
          label;
      const cluster_value = _.reduce(context.markers, (acc, marker) => {
        let num = acc;
        num += marker.getExtData()[this.clusterKey];
        return parseFloat(num.toFixed(2));
      }, 0);
      if (this.clusterKey) {
        currentStyle = this._getClusterStyle(cluster_value, this.clusterKey);
        label = this.getInnerLabel(cluster_value);
      } else {
        currentStyle = this._getClusterStyle(context.count, 'count');
        label = this.getInnerLabel(context.count);
      }

      return { label, currentStyle };
    },

    _getClusterStyle (value, key) {
      const currentStyle = _.findLast(
        _.sortBy(this.clusterStyleMap, key),
        item => value >= item[key]
      );

      return {
        ...DEFAULT_CLUSTER_STYLE,
        ...currentStyle,
      };
    },

    getInnerLabel (count) {
      const {
        fontSize,
        color,
        fontWeight,
      } = this.clusterInnerLabelStyle;

      const labelFontStyle = `
        font-weight: ${fontWeight};
        color: ${color};
        font-size:${fontSize}px;
      `;

      return `<div
        style="${INNER_LABERL_FIXED_STYLE}${labelFontStyle}"
      >
        ${count}
      </div>`;
    },
  },
};
</script>
