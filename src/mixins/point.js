import _ from 'lodash';
import markers from '../components/map_point/markers.json';

const { icons: [{ icons: ICONS }], size: [SIZE] } = markers;

const POINT_TYPES = [
  'circle',
  'triangle',
  'triangle-down',
  'hexagon',
  'water-droplet',
  'pentagram',
];

export default {
  data () {
    return {
      generateMarkers: [],
    };
  },
  methods: {
    styleResults (point, levelOption, style, vkey = 'value') {
      const { pointStyle, labelStyle, icon } = style;

      return {
        point: {
          ...pointStyle,
          ...this.levelOptionParse(point, vkey, levelOption),
        },
        labelStyle,
        icon,
      };
    },

    levelOptionParse (content, key, option) {
      const pointValue = content[key];
      let matchStyle = {};

      if (!_.isNumber(pointValue)) return {};
      option.sort((a, b) => a.value - b.value);

      _.forEach(option, ({ value, style }) => {
        if (pointValue >= value) {
          matchStyle = style;
        }
      });

      return matchStyle;
    },

    getStringWidth (text, fontSize = 16, fontFamily = 'sans-serif') {
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      ctx.font = `${fontSize}px ${fontFamily}`;
      const { width } = ctx.measureText(text);
      return width;
    },

    getLabel (label = '', diameter = 0, style = {}) {
      if (!label) return '';

      const { color, fontWeight, fontSize } = style;
      const fontWidth = this.getStringWidth(label, 12);
      const fontOffset = -(fontWidth - diameter) / 2;

      const node = `<div
          style="
            position: absolute;
            width:${fontWidth}px;
            height:100%;
            left:${fontOffset}px;
            line-height:${diameter}px;
            color:${color};
            font-weight:${fontWeight};
            font-size:${fontSize};
            opacity: 0.8;
          "
        >
          ${label}
        </div>`;
      return node;
    },

    getGraphics (labelText, style, currentIcon) {
      const {
        point: {
          radius,
          fill,
          strokeWidth,
          strokeColor,
        },
        labelStyle,
        icon,
      } = style;

      // 实际 icon 加上边框大小
      const viewDiameter = SIZE + (strokeWidth * 2);
      // 用户设置的 icon 大小
      const userDiameter = radius * 2;

      let iconType = currentIcon;

      if (POINT_TYPES.includes(icon)) iconType = icon;

      const node = `<div style="width:${userDiameter}px;height:${userDiameter}px">
        ${this.getLabel(labelText, userDiameter, labelStyle)}
        <svg
            viewBox="0 0 ${viewDiameter} ${viewDiameter}"
            width="100%"
            height="100%"
          >
          <path
            stroke-width="${strokeWidth}"
            stroke="${strokeColor}"
            fill="${fill}"
            transform="translate(${strokeWidth} ${strokeWidth})"
            d='${ICONS[iconType].paths}'>
        </svg>
      </div>`;

      return node;
    },
  },

  render () {
    return null;
  },
};