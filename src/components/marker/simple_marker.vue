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
            offset: new AMap.Pixel(-10, -10),
            map: this.map,
            showPositionPoint: true,
            position: marker.location,
          })
        );
      });
    },

    _getMarkerContent (marker) {
      const textContent = this._getTextContent(marker);
      return `<div class="clip-marker-content">
        <div class="clip-marker-text-content">${textContent}</div>
        <img style="width:80px; height: 80px" src="${marker.img}" class="clip-${marker.icon}"/>
      </div>`;
    },

    _getTextContent (marker) {
      const labels = marker.label;
      if (_.isArray(labels)) {
        return _.reduce(labels, (acc, label) => {
          const style = {
            ...LABEL_STYLE,
            ...label.style,
          };
          return `${acc}<div style="font-size:${style.fontSize}px; color: ${style.color}; position: relative;">${label.text}</div>`;
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
}

.clip-star {
  transition: 0.4s cubic-bezier(1, -1, 0, 2);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
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
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.clip-water {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
</style>
