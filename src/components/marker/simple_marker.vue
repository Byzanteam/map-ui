<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';

const MARKER_SHAPES = [
  'Circle',
  'FivePointsStar',
  'WaterDrop',
  'Triangle',
  'TriangleDown',
  'Hexagon',
];

const LABEL_STYLE = {
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
    labelStyle: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: 'Circle',
      validator: value => MARKER_SHAPES.includes(value),
    },
  },

  data () {
    return {
      markerRefs: [],
      SimpleMarker: null,
    };
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
      const textContent = this._getTextContent(marker);
      const {
        padding,
        offset = [],
        fontWeight,
      } = { ...LABEL_STYLE, ...this.labelStyle, ...marker.labelStyle };
      const { size: markerSize } = {
        ...DEFAULT_MAERKER_POINT_STYLE,
        ...this.markerStyle,
        ...marker.style,
      };
      return `<div class="clip-marker-content">
        <div
          class="clip-marker-text-content"
          style="padding: ${padding}px; left: ${offset[0]}px; top: ${offset[1]}px; font-weight: ${fontWeight}"
        >
          ${textContent}
        </div>
        <img style="width: ${markerSize}px; height: ${markerSize}px" src="${marker.img}" class="clip-${marker.icon}"/>
      </div>`;
    },

    _getTextContent (marker) {
      const labels = marker.label;
      if (_.isArray(labels)) {
        return _.reduce(labels, (acc, label) => {
          const style = {
            ...LABEL_STYLE,
            ...this.labelStyle,
            ...label.style,
          };
          return `${acc}<div style="font-size:${style.fontSize}px; color: ${style.color}; font-weight: ${style.fontWeight}"; position: relative;">${label.text}</div>`;
        }, '');
      }
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

.clip-triangle-down {
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
