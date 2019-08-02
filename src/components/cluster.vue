<template>
  <div>
    <slot />
  </div>
</template>

<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';
import Icons from './marker/icons.json';

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
  borderColor: 'rgba(255, 255, 255, 0.2)',
  borderWidth: 1,
};

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
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

  mixins: [MapMixin],

  props: {
    icon: {
      type: String,
      default: 'circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    innerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
    clusterStyle: {
      type: Object,
      default: () => ({}),
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

  data () {
    return {
      markersGroup: {},
      cluster: null,
    };
  },

  computed: {
    clusterInnerLabelStyle () {
      return {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...this.innerLabelStyle,
      };
    },
    markers () {
      return Object.values(this.markersGroup).reduce(
        (acc, cur) => [...acc, ...cur], []
      );
    },
  },

  watch: {
    markers () {
      this.clear();
      this.updateCluster();
    },
  },

  created () {
    this.$on('markersRendered', ({ source, payload }) => this.$set(this.markersGroup, source, payload));
  },

  methods: {
    mapLoadedFunc () {
      this.renderCluster();
    },
    clear () {
      this.cluster && this.cluster.clearMarkers();
    },
    renderCluster () {
      this.map.plugin(['AMap.MarkerClusterer'], () => {
        this.cluster = new AMap.MarkerClusterer(
          this.map,
          this.markers,
          {
            gridSize: 80,
            renderClusterMarker: this.getClusterContent,
          }
        );
        this.cluster.on('click', e => (this.$emit('clusterClick', e)));
      });
    },
    updateCluster () {
      this.cluster.setMarkers(this.markers);
    },
    getClusterContent (context) {
      const { label, currentStyle } = this._getClusterLabelAndStyle(context);
      const {
        color,
        size,
        type,
        borderColor,
        borderWidth,
      } = currentStyle;

      const { fontSize } = {
              ...this.innerLabelStyle,
              ...currentStyle.innerLabelStyle,
            },
            clusterSize = fontSize + (size * 2),
            icon = type || this.icon;

      const node = `<div
        style="width: ${clusterSize}px;height: ${clusterSize}px;font-size: 0px;position: relative;">
        ${label}
        <svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" height="100%">
          <path
            stroke-width="${borderWidth}px"
            stroke="${borderColor}"
            fill="${color}"
            d="${ICONS[icon].paths}"
          />
        </svg>
      </div>`;

      context.marker.setContent(node);
    },

    _getClusterLabelAndStyle ({ count, markers }) {
      if (this.clusterKey) {
        const total = _.reduce(markers, (acc, marker) => {
          const sum = acc + marker.getExtData()[this.clusterKey];
          return sum;
        }, 0);
        const cluster_value = parseFloat(total.toFixed(2));
        const currentStyle = this._getClusterStyle(cluster_value);
        return {
          label: this.getInnerLabel(cluster_value, currentStyle),
          currentStyle,
        };
      }

      const currentStyle = this._getClusterStyle(count);
      return {
        label: this.getInnerLabel(count, currentStyle),
        currentStyle,
      };
    },

    _getClusterStyle (value) {
      const currentStyle = _.findLast(
        _.sortBy(this.clusterStyleMap, 'limit'),
        item => value >= item.limit
      );

      return {
        ...DEFAULT_CLUSTER_STYLE,
        ...this.clusterStyle,
        ...currentStyle,
      };
    },

    getInnerLabel (count, style) {
      const {
        fontSize,
        color,
        fontWeight,
      } =  {
        ...this.clusterInnerLabelStyle,
        ...style.innerLabelStyle,
      };

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
