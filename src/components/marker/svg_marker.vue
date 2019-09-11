<script>
import _ from 'lodash';
import MapMixin from '../../mixins/map';

const MARKER_STYLE = {
  shape: 'Circle',
  height: 40,
  strokeWidth: 1,
  strokeColor: '#ccc',
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
    shape: {
      type: String,
      default: 'Circle',
      validator: value => DEFAULT_SHAPE_TYPES.includes(value),
    },
  },

  data () {
    return {
      markerRefs: [],
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
          this.renderMarkers(this.markers, SvgMarker);
        });
      }
    },
    renderMarkers (markers, SvgMarker) {
      _.each(this.markers, (marker) => {
        const shape = new SvgMarker.Shape[this.shape](MARKER_STYLE);
        this.markerRefs.push(new SvgMarker(
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
