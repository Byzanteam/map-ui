<script>
import _ from 'lodash';

import MapMixin from '../../mixins/map';
import Icons from './icons.json';

const { icons: [{ icons: ICONS }], size: [SIZE] } = Icons;

const DEFAULT_MAERKER_POINT_STYLE = {
  color: '#04BF78',
  size: 24,
  strokeColor: 'rgba(255, 255, 255, 0.2)',
  strokeWidth: 1,
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

const DEFAULT_INNER_LABEL_STYLE = {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.2)',
  fontWeight: 400,
  padding: [2, 4],
  offset: [0, 0],
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
      default: 'circle',
      validator: value => DEFAULT_ICON_TYPES.includes(value),
    },
    innerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      uuid: _.uniqueId(),
    };
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
      this.renderMarker();
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
          this.renderMarker();
        });
      }
    },

    renderMarker () {
      if (this.markerPointStyle.color !== 'transparent') {
        const shape = this._renderShape();
        const marker = new this.SvgMarker(
          shape,
          {
            map: this.map,
            position: this.marker.location,
            iconLabel: this._getLabelContent(),
          },
        );
        marker.on('click', e => this.$emit('markerClick', e));
        marker.on('mouseover', e => this.$emit('markerMouseover', e));
        marker.on('mouseout', e => this.$emit('markerMouseout', e));
        this.$emit('markerCreated', marker);
      }
    },

    customShape () {
      const { utils } = this;
      _.forEach(CUSTOM_SVG, (icon) => {
        const CustomShape = function (options) {
          const opts = utils.extend({
            ...DEFAULT_MAERKER_POINT_STYLE,
          }, options);

          CustomShape.__super__.constructor.call(this, opts);
        };
        utils.inherit(CustomShape, this.SvgMarker.Shape.BaseShape);
        this._generateCustomShapeDom(CustomShape, icon);
        const newShape = {};
        newShape[icon] = CustomShape;
        utils.extend(this.SvgMarker.Shape, newShape);
      });
    },

    _generateCustomShapeDom (CustomShape, icon) {
      this.utils.extend(CustomShape.prototype, {
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
    },

    _getLabelContent () {
      const { label = '' } = this.marker;
      const {
        padding,
        offset,
        textStyles: markerTextStyles = [],
      } = this.markerInnerLabelStyle;
      const { textStyles = [] } = this.markerPointStyle.innerLabelStyle || {};
      let content;
      if (_.isArray(label)) {
        content = _.reduce(label, (acc, item, key) => {
          const {
            fontSize,
            color,
            fontWeight,
          } = {
            ...this.markerInnerLabelStyle,
            ...markerTextStyles[key],
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
          top: `${offset[1]}px`,
          left: `${offset[0]}px`,
        },
      };
    },

    _renderShape () {
      const {
        color,
        size,
        icon,
        strokeColor,
        strokeWidth,
      } = this.markerPointStyle;

      return new this.SvgMarker.Shape[icon || this.icon]({
        width: size,
        height: size,
        strokeWidth,
        strokeColor,
        fillColor: color,
      });
    },
  },
};

export default MarkerPoint;
</script>
