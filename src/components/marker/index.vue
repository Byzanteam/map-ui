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
  name: 'MarkerPoint',

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
      validator: value => DEFAULT_ICON_TYPES.includes(value),
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

    renderMarker (data) {
      if (_.isEmpty(data) || this.markerStyle.color === 'transparent') {
        this.$emit('marker-rendered');
        return;
      }
      const shape = this._getShape();
      this.marker = new this.SvgMarker(
        shape,
        {
          map: this.map,
          position: data.location,
          iconLabel: this._getLabelContent(shape),
          extData: data,
        },
      );
      this.marker.on('click', e => this.$emit('marker-clicked', e));
      this.marker.on('mouseover', e => this.$emit('marker-mouseover', e));
      this.marker.on('mouseout', e => this.$emit('marker-mouseout', e));
      this.$emit('marker-rendered', this.marker);
    },

    _getLabelContent (shape) {
      const { label = '' } = this.point;
      if (!label) return;

      const labelCenter = shape.getCenter();
      const {
        padding,
        offset = [labelCenter[1], 0],
        textStyles = [],
      } = this.markerInnerLabelStyle;

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
        innerHTML: content,
        style: {
          top: `${offset[1]}px`,
          left: `${offset[0]}px`,
          padding: `${padding[0]}px ${padding[1]}px`,
          'white-space': 'nowrap',
        },
      };
    },

    setMarkerData (data) {
      if (this.map && this.SvgMarker) {
        this.clear();
        this.renderMarker(data);
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
      } = this.markerPointStyle;

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
        offset: this._getShapeOffset(size),
      });
    },

    _getShapeOffset (size) {
      let offset = [];
      switch (true) {
        case _.includes(POSITION_TOP_ICON, this.icon): {
          offset = [-(size / 2), 0];
          break;
        }
        case _.includes(POSITION_BOTTOM_ICON, this.icon): {
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
