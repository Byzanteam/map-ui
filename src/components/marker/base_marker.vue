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

const DEFAULT_ICON = 'circle';

export const MarkerPoint = {
  name: 'BaseMarker',

  mixins: [MapMixin],

  data () {
    return {
      SvgMarker: null,
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
          this.$emit('markerReady');
        });
      }
    },

    renderMarker (point, markerStyle) {
      if (!this.SvgMarker || _.isEmpty(point)) return;
      const shape = this._getShape(markerStyle);
      const marker = new this.SvgMarker(
        shape,
        {
          map: this.map,
          position: point.location,
          iconLabel: this._getLabelContent(point, shape, markerStyle),
          extData: point,
        },
      );
      marker.on('click', e => this.$emit('marker-clicked', e));
      marker.on('mouseover', e => this.$emit('marker-mouseover', e));
      marker.on('mouseout', e => this.$emit('marker-mouseout', e));
      return marker;
    },

    _getLabelContent (marker, shape, markerStyle) {
      const { label = '' } = marker;
      if (!label) return;
      const labelCenter = shape.getCenter();
      const innerLabelStyle = {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...markerStyle.innerLabelStyle,
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

    _getShape (markerStyle) {
      const {
        color,
        size,
        icon = DEFAULT_ICON,
        strokeColor,
        strokeWidth,
      } = {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...markerStyle,
      };

      if (!_.includes(DEFAULT_ICON_TYPES, icon)) {
        throw new Error(`icon not found:
          choose one of [triangle, waterDrop, triangleDown, hexagon, circle, fivePointsStar]
        `);
      }

      const IconShape = this.SvgMarker.Shape[_.upperFirst(icon)];
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
        icon: `icon-${icon}`,
        width: size,
        height: size,
        strokeWidth,
        strokeColor,
        fillColor: color,
        offset: this._getShapeOffset(icon, size),
      });
    },

    _getShapeOffset (icon, size) {
      if (_.includes(POSITION_TOP_ICON, icon)) {
        return [-(size / 2), 0];
      }
      if (_.includes(POSITION_BOTTOM_ICON, icon)) {
        return [-(size / 2), -size];
      }
      if (_.includes(POSITION_CENTER_ICON, icon)) {
        return [-(size / 2), -(size / 2)];
      }
    },
  },

  render () {
    return null;
  },
};

export default MarkerPoint;
</script>
