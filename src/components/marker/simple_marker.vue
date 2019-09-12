<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';

const MARKER_SHAPES = [
  'circle',
  'star',
  'waterDrop',
  'triangle',
  'triangleDown',
  'hexagon',
];

const DEFAULT_LABEL_STYLE = {
  fontSize: 12,
  padding: 10,
  fontWeight: 400,
  color: 'rgba(255, 255, 255, 0.2)',
};

const DEFAULT_MAERKER_POINT_STYLE = {
  size: 24,
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
    markerLabelStyle: {
      type: Object,
      default: () => ({}),
    },
    markerStyleMap: {
      type: Array,
      default: () => null,
    },
    icon: {
      type: String,
      default: 'circle',
      validator: value => MARKER_SHAPES.includes(value),
    },
  },

  data () {
    return {
      markerRefs: [],
      SimpleMarker: null,
    };
  },

  computed: {
    markerPointStyle () {
      return {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
      };
    },
    innerLabelStyle () {
      return {
        ...DEFAULT_LABEL_STYLE,
        ...this.markerLabelStyle,
      };
    },
  },

  methods: {
    sourceReadyFunc () {
      if (typeof AMapUI === 'undefined') {
        window.console.error(`AMapUI not found:
          SimpleMarker component required AMapUI
          please set use-map-ui property on base-map
        `);
      } else {
        AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
          this.SimpleMarker = SimpleMarker;
          this.renderMarkers();
        });
      }
    },
    renderMarkers () {
      _.each(this.markers, (marker) => {
        this.markerRefs.push(
          new this.SimpleMarker({
            iconStyle: this._getMarkerContent(marker),
            map: this.map,
            position: marker.location,
          })
        );
      });
    },

    _getMarkerContent (marker) {
      const {
        size: markerSize,
        icon,
        img,
        labelStyles,
      } = this._getMarkerStyle(marker);
      const textContent = this._getTextContent(marker, labelStyles);
      const {
        padding,
        offset = [],
      } = this.innerLabelStyle;

      return `<div class="clip-marker-content">
        <div
          class="clip-marker-text-content"
          style="padding: ${padding}px; left: ${offset[0]}px; top: ${offset[1]}px;"
        >
          ${textContent}
        </div>
        <img style="width: ${markerSize}px; height: ${markerSize}px" src="${img || marker.img}" class="clip-${icon || this.icon}"/>
      </div>`;
    },

    _getMarkerStyle (marker) {
      if (!this.markerStyleMap || !_.isNumber(marker.value)) {
        return this.markerPointStyle;
      }

      const currentStyle = _.findLast(
        _.sortBy(this.markerStyleMap, 'value'),
        ({ value }) => marker.value >= value
      );

      return {
        size: this.markerPointStyle.size,
        ...currentStyle,
      };
    },

    _getTextContent (marker, styles = []) {
      const { label } = marker;
      const { labelStyles = [] } = marker;
      if (_.isArray(label)) {
        return _.reduce(label, (acc, item, key) => {
          const {
            fontSize,
            color,
            fontWeight,
          } = {
            ...this.innerLabelStyle,
            ...labelStyles[key],
            ...styles[key],
          };
          return `${acc}<div style="font-size:${fontSize}px; color: ${color}; font-weight: ${fontWeight}"; position: relative;">${item}</div>`;
        }, '');
      }
      const { fontSize, color, fontWeight } = this.innerLabelStyle;
      return `<div style="font-size:${fontSize}px; color: ${color}; font-weight: ${fontWeight}"; position: relative;">${label}</div>`;
    },
  },

};
</script>

<style lang="scss">
.clip-marker-content {
  position: relative;
  z-index: 1;
}

.clip-marker-text-content {
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  white-space: nowrap;
}

.clip-waterDrop {
  clip-path: path('M12 24C6 17.45 3 12.29 3 8.5 3 2.82 6.04 0 12 0s9 2.82 9 8.5c0 3.79-3 8.95-9 15.5z');
}

.clip-star {
  transition: 0.4s cubic-bezier(1, -1, 0, 2);
  clip-path: polygon(
    50% 0%, 61% 35%,
    98% 35%, 68% 57%,
    79% 91%, 50% 70%,
    21% 91%, 32% 57%,
    2% 35%, 39% 35%
  );
}

.clip-circle {
  clip-path: circle(50% at 50% 50%);
}

.clip-triangle {
  clip-path: polygon(50% 0%, 0 70%, 100% 70%);
}

.clip-triangleDown {
  clip-path: polygon(100% 30%, 0 30%, 50% 100%);
}

.clip-hexagon {
  clip-path: polygon(
    50% 0%,
    100% 25%,
    100% 75%,
    50% 100%,
    0% 75%,
    0% 25%
  );
}

.clip-water {
  clip-path: polygon(
    50% 0%,
    100% 25%,
    100% 75%,
    50% 100%,
    0% 75%,
    0% 25%
  );
}
</style>
