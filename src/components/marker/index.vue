<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';
import '../../iconfont/iconfont';
import '../../iconfont/icon.scss';

const POSITION_TOP_ICON = [
  'triangle',
];

const POSITION_BOTTOM_ICON = [
  'waterDrop',
  'triangleDown',
];

const POSITION_CENTER_ICON = [
  'hexagon',
  'circle',
  'fivePointsStar',
];

const DEFAULT_ICON_TYPES = [].concat(
  POSITION_TOP_ICON,
  POSITION_BOTTOM_ICON,
  POSITION_CENTER_ICON
);

const DEFAULT_MAERKER_POINT_STYLE = {
  color: '#04BF78',
  size: 24,
  strokeColor: 'rgba(255, 255, 255, 0.2)',
  strokeWidth: 1,
};

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
  padding: [2, 4],
};

export const MarkerPoint = {
  name: 'BaseMarker',

  mixins: [MapMixin],

  props: {
    point: {
      type: Object,
      default: () => ({}),
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: 'circle',
    },
    innerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    point (current) {
      this.setMarkerData(current);
    },
    markerStyle () {
      this.setMarkerData(this.point);
    },
    innerLabelStyle () {
      this.setMarkerData(this.point);
    },
    icon () {
      this.setMarkerData(this.point);
    },
  },

  data () {
    return {
      marker: null,
    };
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
          this.renderMarker(this.point);
        });
      }
    },

    renderMarker (item) {
      if (_.isEmpty(item) || this.markerStyle.color === 'transparent') {
        this.$emit('markerRendered');
        return;
      }
      const shape = this._getShape();
      this.marker = new this.SvgMarker(
        shape,
        {
          map: this.map,
          position: item.location,
          iconLabel: this._getLabelContent(shape),
          extData: item,
        },
      );
      this.marker.on('click', e => this.$emit('marker-clicked', e));
      this.marker.on('mouseover', e => this.$emit('marker-mouseover', e));
      this.marker.on('mouseout', e => this.$emit('marker-mouseout', e));
      this.$emit('markerRendered', this.marker);
    },

    _getLabelContent (shape) {
      const { label = '' } = this.point;
      if (!label) return;
      const labelCenter = shape.getCenter();
      const innerLabelStyle = {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...this.innerLabelStyle,
      };
      const {
        padding,
        offset = [labelCenter[1], 0],
        textStyles = [],
      } = innerLabelStyle;
      let content;
      if (_.isArray(label)) {
        content = _.reduce(label, (acc, item, key) => {
          const { fontSize, color, fontWeight } = {
            ...innerLabelStyle,
            ...textStyles[key],
          };
          return `${acc}<div style="font-size:${fontSize}px; color: ${color}; font-weight: ${fontWeight}"; position: relative;">${item}</div>`;
        }, '');
      } else {
        const { fontSize, color, fontWeight } = innerLabelStyle;
        content = `<div style="font-size:${fontSize}px; color: ${color}; font-weight: ${fontWeight}"; position: relative;">${label}</div>`;
      }
      return {
        innerHTML: content,
        style: {
          top: `${offset[1]}px`,
          left: `${offset[0]}px`,
          padding: `${padding[0]}px ${padding[1]}px`,
          'white-space': 'nowrap',
        },
      };
    },

    setMarkerData () {
      if (this.map && this.SvgMarker) {
        this.clear();
        this.renderMarker(this.point);
      }
    },

    clear () {
      if (this.marker) {
        this.map.remove(this.marker);
      }
      this.marker = null;
    },

    _getShape () {
      const {
        color,
        size,
        strokeColor,
        strokeWidth,
      } = {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };

      if (!_.includes(DEFAULT_ICON_TYPES, this.icon)) {
        throw new Error(`icon not found:
          choose one of [triangle, waterDrop, triangleDown, hexagon, circle, fivePointsStar]
        `);
      }

      const IconShape = this.SvgMarker.Shape[_.upperFirst(this.icon)];
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
        icon: `icon-${this.icon}`,
        width: size,
        height: size,
        strokeWidth,
        strokeColor,
        fillColor: color,
        offset: this._getShapeOffset(this.icon, size),
      });
    },

    _getShapeOffset (icon, size) {
      let offset = [];
      switch (true) {
        case _.includes(POSITION_TOP_ICON, icon): {
          offset = [-(size / 2), 0];
          break;
        }
        case _.includes(POSITION_BOTTOM_ICON, icon): {
          offset = [-(size / 2), -size];
          break;
        }
        default: {
          offset = [-(size / 2), -(size / 2)];
          break;
        }
      }
      return offset;
    },
  },

  render () {
    return null;
  },
};

export default MarkerPoint;
</script>
