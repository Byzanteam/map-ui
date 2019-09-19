<script>
import _ from 'lodash';

import MapMixin from '../../mixins/map';
import '../../iconfont/iconfont';
import '../../iconfont/icon.scss';

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

export const MarkerPoint = {
  name: 'BasicMarker',

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
      if (!this.SvgMarker) return;
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
      marker.on('click', e => this.$emit('markerClick', e));
      marker.on('mouseover', e => this.$emit('markerMouseover', e));
      marker.on('mouseout', e => this.$emit('markerMouseout', e));
      return marker;
    },

    _getLabelContent (marker, shape, markerStyle) {
      const { label = '' } = marker;
      const labelCenter = shape.getCenter();
      const { innerLabelStyle } = markerStyle;
      const {
        padding,
        offset = [],
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
      } = markerStyle;

      const IconShape = this.SvgMarker.Shape[icon];

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
        icon: `icon-${_.camelCase(icon)}`,
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
