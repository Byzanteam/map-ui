<script>
import _ from 'lodash';

import MapMixin from '../../mixins/map';
import Icons from './icons.json';

const { icons: [{ icons: ICONS }], size: [SIZE] } = Icons;

const DEFAULT_MAERKER_POINT_STYLE = {
  color: '#04BF78',
  size: 24,
};

const MAPUI_SVG = [
  'Circle',
  'FivePointsStar',
  'WaterDrop',
];

const CUSTOM_SVG = [
  'Triangle',
  'TriangleDown',
  'Hexagon',
];

const DEFAULT_ICON_TYPES = MAPUI_SVG.concat(CUSTOM_SVG);

const DEFAULT_STYLE_MAP = null;

const DEFAULT_BORDER = {
  color: 'rgba(255, 255, 255, 0.2)',
  width: 1,
};

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
  padding: [2, 4],
  offset: [0, 0],
};

export const MarkerPoint = {
  name: 'MarkerPoint',

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
      default: 'circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    markerStyleMap: {
      type: Array,
      default: () => DEFAULT_STYLE_MAP,
    },
    borderStyle: {
      type: Object,
      default: () => ({}),
    },
    innerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      markerRefs: [],
      uuid: _.uniqueId(),
    };
  },

  watch: {
    markers (current) {
      this.setMarkerData(current);
    },
    markerStyleMap () {
      this.setMarkerData(this.markers);
    },
    innerLabelStyle () {
      this.setMarkerData(this.markers);
    },
    icon () {
      this.setMarkerData(this.markers);
    },
  },

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };
    },
    markerBorderStyle () {
      return {
        ...DEFAULT_BORDER,
        ...this.borderStyle,
      };
    },
    markerInnerLabelStyle () {
      return {
        ...DEFAULT_INNER_LABEL_STYLE,
        ...this.innerLabelStyle,
      };
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

    renderMarkers (data) {
      if (!data.length) return;

      this.markerRefs = _.map(data, (item) => {
        const markerStyle = this.getMarkerStyle(item);
        if (markerStyle) {
          const { innerLabelStyles } = markerStyle;
          const shape = this._renderShape(item);
          const marker = new this.SvgMarker(
            shape,
            {
              map: this.map,
              position: item.location,
              containerClassNames: `shape-${this.icon}`,
              iconLabel: this._getTextContent(item, innerLabelStyles),
            },
          );
          marker.on('click', e => this.$emit('markerClick', e));
          marker.on('mouseover', e => this.$emit('markerMouseover', e));
          marker.on('mouseout', e => this.$emit('markerMouseout', e));

          return marker;
        }
      });
      this.$parent.$emit('markersRendered', {
        source: this.uuid,
        payload: this.markerRefs,
      });
    },

    customShape () {
      const { utils } = this;
      _.each(CUSTOM_SVG, (icon) => {
        const CustomShape = function (options) {
          const opts = utils.extend({
            ...DEFAULT_MAERKER_POINT_STYLE,
            color: DEFAULT_MAERKER_POINT_STYLE.color,
          }, options);

          CustomShape.__super__.constructor.call(this, opts);
        };
        utils.inherit(CustomShape, this.SvgMarker.Shape.BaseShape);
        utils.extend(CustomShape.prototype, {
          getInnerHTML (params) {
            const {
              strokeWidth,
              strokeColor,
              color,
            } = params;
            return `<svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" height="100%">
                    <path
                      stroke-width="${strokeWidth}px"
                      stroke="${strokeColor}"
                      fill="${color}"
                      d="${ICONS[_.kebabCase(icon)].paths}"
                    />
                  </svg>`;
          },
          getOffset () {
            // 计算三角形容器实际的高度， 0.4是实际的高度和设置的高度值的差的倍数
            const diff = (this.getHeight() * 0.4);
            // 定位点在底部
            if (icon === 'TriangleDown') {
              return [-(this.getWidth() / 2), -(this.getHeight() - (diff / 2))];
            }
            // 定位点在顶部
            if (icon === 'Triangle') {
              return [-(this.getWidth() / 2), -(diff / 2)];
            }
            // 定位点默认在图形中部:
            return [-(this.getWidth() / 2), -(this.getHeight() / 2)];
          },
        });
        const newProperty = {};
        newProperty[icon] = CustomShape;
        utils.extend(this.SvgMarker.Shape, newProperty);
      });
      this.renderMarkers(this.markers);
    },

    setMarkerData (data) {
      if (this.map) {
        this.clear();
        this.renderMarkers(data);
      }
    },

    clear () {
      _.forEach(this.markerRefs, (marker) => {
        if (marker) {
          this.map.remove(marker);
        }
      });
      this.markerRefs = [];
    },

    /**
     * 如果设置了映射，小于最小映射的透明色
     */
    getMarkerStyle (marker) {
      if (!this.markerStyleMap || !_.isNumber(marker.value)) {
        return this.markerPointStyle;
      }

      const currentStyle = _.findLast(
        _.sortBy(this.markerStyleMap, 'value'),
        ({ value }) => marker.value >= value
      );

      if (currentStyle) {
        return {
          ...this.markerPointStyle,
          ...currentStyle,
        };
      }
    },

    _getTextContent (marker, innerLabelStyles = []) {
      const { label = '', innerLabelStyles: markerLabelStyle = [] } = marker;
      const { padding, offset } = this.markerInnerLabelStyle;
      let content;
      if (_.isArray(label)) {
        content = _.reduce(label, (acc, item, key) => {
          const {
            fontSize,
            color,
            fontWeight,
          } = {
            ...this.markerInnerLabelStyle,
            ...markerLabelStyle[key],
            ...innerLabelStyles[key],
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
          top: `${offset[1]}px`,
          left: `${offset[0]}px`,
        },
      };
    },

    _renderShape (marker) {
      const {
        color,
        size,
        icon,
        borderStyle,
      } = this.getMarkerStyle(marker);

      const {
        color: borderColor,
        width,
      } = {
        ...this.markerBorderStyle,
        ...borderStyle,
      };

      return new this.SvgMarker.Shape[icon || this.icon]({
        width: size,
        height: size,
        strokeWidth: width,
        strokeColor: borderColor,
        fillColor: color,
      });
    },
  },
};

export default MarkerPoint;
</script>
