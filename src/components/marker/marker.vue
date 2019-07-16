<template>
  <span>
    <slot name="cluster" />
  </span>
</template>

<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';
import Icons from './markers.json';

const { icons: [{ icons: ICONS }], size: [SIZE] } = Icons;

const DEFAULT_ICON = 'circle';

const MARKER_TYPES = [
  'circle',
  'triangle',
  'triangle-down',
  'hexagon',
  'water-droplet',
  'pentagram',
];

const DEFAULT_STYLE = {
  radius: 20,
  strokeColor: '#767676',
  strokeWidth: 1,
  fill: '#4e6398',
};

const DEFAULT_MAERKER_LABEL = {
  fontSize: '12px',
  color: '#888',
  fontWeight: 400,
};

const DEFAULT_MAERKER_VALUE = [
  { value: 3, style: { fill: '#E28E49' } },
  { value: 2, style: { fill: '#EAC438' } },
  { value: 1, style: { fill: '#A6B76F' } },
];

export const Markers = {
  name: 'Markers',

  mixins: [MapMixin],

  props: {
    markerStyle: {
      type: Object,
      default: () => ({}),
    },
    valueOption: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array,
      default: () => [],
    },
    labelKey: {
      type: String,
      default: 'label',
    },
  },

  data () {
    return {
      markers: [],
    };
  },

  computed: {
    markerResult () {
      const {
        marker = {},
        label = {},
        icon = '',
      } = this.markerStyle;

      return {
        markerStyle: {
          ...DEFAULT_STYLE,
          ...marker,
        },
        labelStyle: {
          ...DEFAULT_MAERKER_LABEL,
          ...label,
        },
        icon,
      };
    },

    levelOptionResult () {
      const {
        marker = [],
        valueKey = 'value',
      } = this.valueOption;
      return {
        markerLv: _.sortedUniqBy([
          ...DEFAULT_MAERKER_VALUE,
          ...marker,
        ], obj => obj.value),
        valueKey,
      };
    },
  },

  methods: {
    mapLoadedFunc () {
      this.initMarkers(this.instance.map);
    },

    initMarkers (map) {
      this.generateMarkers();
      this.renderMarkers(map);
    },

    generateMarkers () {
      const { markerLv, valueKey } = this.levelOptionResult;
      this.markers = this.data.map((extData) => {
        const content = this.getGraphics(
          extData[this.labelKey],
          this.styleResults(
            extData,
            markerLv,
            this.markerResult,
            valueKey,
          ),
        );
        const center = this.markerResult.markerStyle.radius;
        const marker = new AMap.Marker({
          position: extData.lnglat,
          anchor: 'bottom-center',
          extData,
          offset: new AMap.Pixel(center, center),
          content,
        });
        marker.on('click', e => this.$emit('markerClick', e));
        return marker;
      });
    },

    renderMarkers (map) {
      if (this.$slots.cluster) return;
      _.forEach(
        this.markers,
        value => value.setMap(map)
      );
    },

    styleResults (marker, levelOption, style, vkey = 'value') {
      const { markerStyle, labelStyle, icon } = style;
      return {
        marker: {
          ...markerStyle,
          ...this.levelOptionParse(marker, vkey, levelOption),
        },
        labelStyle,
        icon,
      };
    },

    levelOptionParse (content, key, option) {
      const markerValue = content[key];
      let matchStyle = {};

      if (!_.isNumber(markerValue)) return {};
      option.sort((a, b) => a.value - b.value);

      _.forEach(option, ({ value, style }) => {
        if (markerValue >= value) {
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

    getGraphics (labelText, style) {
      const {
        marker: {
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

      let iconType = DEFAULT_ICON;

      if (MARKER_TYPES.includes(icon)) iconType = icon;

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
};

export default Markers;
</script>
