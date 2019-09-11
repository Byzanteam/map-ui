<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';
import Icons from './icons.json';

const { icons: [{ icons: ICONS }], size: [SIZE] } = Icons;

const MARKER_STYLE = {
  shape: 'Circle',
  width: 24,
  height: 24,
  strokeWidth: 1,
  strokeColor: 'rgba(255, 255, 255, 0.2)',
  fillColor: '#04BF78',
};

const DEFAULT_SHAPE_TYPES = [
  'Circle',
  'Triangle',
  'FivePointsStar',
  'WaterDrop',
  'Hexagon',
];

const LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
};

export default {
  mixins: [MapMixin],

  props: {
    markers: {
      type: Array,
      default: () => [],
    },
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: 'Circle',
      validator: value => DEFAULT_SHAPE_TYPES.includes(value),
    },
  },

  data () {
    return {
      markerRefs: [],
      SvgMarker: null,
      utils: null,
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
        AMapUI.loadUI(['../lib/utils', 'overlay/SvgMarker'], (utils, SvgMarker) => {
          if (!SvgMarker.supportSvg) {
            return window.console.error('当前环境不支持SVG');
          }
          this.SvgMarker = SvgMarker;
          this.utils = utils;
          this.customShape();
        });
      }
    },
    renderMarkers (markers) {
      _.each(markers, (marker) => {
        const shape = this._renderShape();
        this.markerRefs.push(new this.SvgMarker(
          shape,
          {
            map: this.map,
            position: marker.location,
            containerClassNames: `shape-${marker.shape}`,
            iconLabel: this._getLabelStyle(marker, shape),
            showPositionPoint: true,
          }
        ));
      });
    },
    customShape () {
      const { utils, icon } = this;
      const TriangleShape = function (options) {
        const opts = utils.extend({
          ...MARKER_STYLE,
          color: MARKER_STYLE.fillColor,
        }, options);

        TriangleShape.__super__.constructor.call(this, opts);
      };
      utils.inherit(TriangleShape, this.SvgMarker.Shape.BaseShape);
      utils.extend(TriangleShape.prototype, {
        getInnerHTML (params) {
          const {
            width,
            height,
            strokeWidth,
            strokeColor,
            color,
          } = params;
          return `<svg viewBox="0 0 ${SIZE} ${SIZE}" width="${width}px" height="${height}px">
                    <path
                      stroke-width="${strokeWidth}px"
                      stroke="${strokeColor}"
                      fill="${color}"
                      d="${ICONS[_.kebabCase(icon)].paths}"
                    />
                  </svg>`;
        },
        getOffset () {
          // 定位点默认在图形中部:
          return [-this.getWidth() / 2, -this.getHeight() / 2];
        },
      });
      utils.extend(this.SvgMarker.Shape, { Triangle: TriangleShape });
      this.renderMarkers(this.markers);
    },
    _renderShape () {
      return new this.SvgMarker.Shape[this.icon](MARKER_STYLE);
    },
    _getLabelStyle (marker, shape) {
      const labelCenter = shape.getCenter();
      return {
        innerHTML: marker.label || '',
        style: {
          top: `${labelCenter[1] - 9}px`,
          ...LABEL_STYLE,
        },
      };
    },
  },

  render () {
    return null;
  },
};
</script>
