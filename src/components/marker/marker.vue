<script>
import _ from 'lodash';

import MapMixin from '../../mixins/map';
import '../../iconfont/iconfont';
import '../../iconfont/icon.scss';


const DEFAULT_MAERKER_POINT_STYLE = {
  color: '#04BF78',
  size: 24,
  strokeColor: 'rgba(255, 255, 255, 0.2)',
  strokeWidth: 1,
};

const POSITION_TOP_ICON = [
  'Triangle',
];

const POSITION_BOTTOM_ICON = [
  'WaterDrop',
  'TriangleDown',
];

const POSITION_CENTER_ICON = [
  'Hexagon',
  'Circle',
  'FivePointsStar',
];

const DEFAULT_ICON_TYPES = [].concat(
  POSITION_TOP_ICON,
  POSITION_BOTTOM_ICON,
  POSITION_CENTER_ICON
);

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
  padding: [2, 4],
};

export const MarkerPoint = {
  name: 'BasicMarker',

  mixins: [MapMixin],

  props: {
    marker: {
      type: Object,
      default: () => ({}),
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: 'Circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    innerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };
    },
    markerInnerLabelStyle () {
      return {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...this.innerLabelStyle,
      };
    },
  },

  watch: {
    marker () {
      this.renderMarker(this.marker);
    },
  },

  methods: {
    sourceReadyFunc () {
      if (typeof AMapUI === 'undefined') {
        window.console.error(`AMapUI not found:
          svgMarker component required AMapUI
          please set use-map-ui property on base-map
        `);
      } else {
        AMapUI.loadUI(['overlay/SvgMarker'], (SvgMarker) => {
          if (!SvgMarker.supportSvg) {
            return window.console.error('当前环境不支持SVG');
          }
          this.SvgMarker = SvgMarker;
          this.renderMarker(this.marker);
          this.$emit('markerReady');
        });
      }
    },

    renderMarker (item, markerStyle = {}) {
      if (_.isEmpty(item)) return;
      const { color } = { ...this.markerPointStyle, ...markerStyle };
      if (color !== 'transparent') {
        const shape = this._getShape(markerStyle);
        const marker = new this.SvgMarker(
          shape,
          {
            map: this.map,
            position: item.location,
            iconLabel: this._getLabelContent(shape, item.label),
          },
        );
        marker.on('click', e => this.$emit('markerClick', e));
        marker.on('mouseover', e => this.$emit('markerMouseover', e));
        marker.on('mouseout', e => this.$emit('markerMouseout', e));
        this.$emit('markerCreated', marker);
      }
    },

    _getLabelContent (shape, label = '') {
      const labelCenter = shape.getCenter();
      const {
        padding,
        offset = [],
        textStyles = [],
      } = {
        ...this.markerInnerLabelStyle,
        ...this.markerPointStyle.innerLabelStyle,
      };
      let content;
      if (_.isArray(label)) {
        content = _.reduce(label, (acc, item, key) => {
          const { fontSize, color, fontWeight } = {
            ...this.markerInnerLabelStyle,
            ...textStyles[key],
          };
          return `${acc}<div style="font-size:${fontSize}px; color: ${color}; font-weight: ${fontWeight}"; position: relative;">${item}</div>`;
        }, '');
      } else {
        const { fontSize, color, fontWeight } = this.markerInnerLabelStyle;
        content = `<div style="font-size:${fontSize}px; color: ${color}; font-weight: ${fontWeight}"; position: relative;">${label}</div>`;
      }
      return {
        innerHTML: `<div
                      class="clip-marker-text-content"
                      style="padding: ${padding[0]}px ${padding[1]}px; white-space: nowrap;"
                    >${content}</div>`,
        style: {
          top: `${offset[1] || labelCenter[1]}px`,
          left: `${offset[0] || 0}px`,
        },
      };
    },

    _getShape (markerStyle) {
      const {
        color,
        size,
        icon,
        strokeColor,
        strokeWidth,
      } = { ...this.markerPointStyle, ...markerStyle };

      const currentIcon = icon || this.icon;

      const IconShape = this.SvgMarker.Shape[currentIcon];

      if (IconShape) {
        return new IconShape({
          width: size,
          height: size,
          strokeWidth,
          strokeColor,
          fillColor: color,
        });
      }
      return new this.SvgMarker.Shape.IconFont({
        symbolJs: null,
        icon: `icon-${_.camelCase(currentIcon)}`,
        width: size,
        height: size,
        strokeWidth,
        strokeColor,
        fillColor: color,
        offset: this._getShapeOffset(currentIcon, size),
      });
    },

    _getShapeOffset (icon, size) {
      if (_.includes(POSITION_TOP_ICON, icon)) {
        return [-(size / 2), 0];
      }
      if (_.includes(POSITION_CENTER_ICON, icon)) {
        return [-(size / 2), -(size / 2)];
      }
      if (_.includes(POSITION_BOTTOM_ICON, icon)) {
        return [-(size / 2), -size];
      }
    },
  },
};

export default MarkerPoint;
</script>
