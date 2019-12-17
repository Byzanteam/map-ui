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

const DEFAULT_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
};

const LABERL_FIXED_STYLE = `
  position: absolute;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
  width: 100%;
  text-align: center;
`;

export const Cluster = {
  name: 'Cluster',

  mixins: [MapMixin],

  props: {
    icon: {
      type: String,
      default: 'circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    labelStyle: {
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
    clusterContent: {
      type: Function,
      default: null,
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
    clusterlabelStyle () {
      return {
        ...DEFAULT_LABEL_STYLE,
        ...this.labelStyle,
      };
    },
    markers () {
      _.transform(
        this.markersGroup, (acc, cur) => acc.push(...acc, ...cur), []
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
      this._renderCluster();
    },

    clear () {
      this.cluster && this.cluster.setMap(null);
    },

    updateCluster () {
      this._renderCluster();
    },

    _renderCluster () {
      this.map.plugin(['AMap.MarkerClusterer'], () => {
        this.cluster = new AMap.MarkerClusterer(
          this.map,
          this.allMarkers,
          {
            gridSize: 80,
            renderClusterMarker: this.clusterContent || this._getClusterContent,
            ...this.options,
          },
        );
        this.cluster.on('click', e => (this.$emit('clusterClick', e)));
      });
    },

    _getClusterContent (context) {
      const { label, currentStyle } = this._getClusterLabelAndStyle(context);
      const {
        color,
        size,
        type,
        borderColor,
        borderWidth,
      } = currentStyle;

      const { fontSize } = {
        ...this.labelStyle,
        ...currentStyle.labelStyle,
      };
      const clusterSize = fontSize + (size * 2);
      const icon = type || this.icon;

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
        const total = _.reduce(
          markers,
          (acc, marker) => acc + marker.getExtData()[this.clusterKey], 0
        );
        const cluster_value = parseFloat(total.toFixed(2));
        const currentStyle = this._getClusterStyle(cluster_value);
        return {
          label: this._getLabel(cluster_value, currentStyle),
          currentStyle,
        };
      }

      const currentStyle = this._getClusterStyle(count);
      return {
        label: this._getLabel(count, currentStyle),
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

    _getLabel (count, style) {
      const {
        fontSize,
        color,
        fontWeight,
      } =  {
        ...this.clusterlabelStyle,
        ...style.labelStyle,
      };

      const labelFontStyle = `
        font-weight: ${fontWeight};
        color: ${color};
        font-size:${fontSize}px;
      `;

      return `<div
        style="${LABERL_FIXED_STYLE}${labelFontStyle}"
      >
        ${count}
      </div>`;
    },

  },
};

export default Cluster;
</script>
