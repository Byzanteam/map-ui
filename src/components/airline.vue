<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const EMPTY_STYLE = {
  lineWidth: 0,
  fillStyle: null,
  strokeStyle: null,
  borderStyle: null,
};

const DEFAULT_RENDER_OPTIONS = {
  renderAllPointsIfNumberBelow: 100,
  pathTolerance: 0,
  pathLineStyle: {
    strokeStyle: 'gray',
    lineWidth: 1,
    borderStyle: null,
  },
  pathLineSelectedStyle: EMPTY_STYLE,
  pathLineHoverStyle: EMPTY_STYLE,
  keyPointStyle: EMPTY_STYLE,
  startPointStyle: EMPTY_STYLE,
  endPointStyle: EMPTY_STYLE,
  keyPointHoverStyle: EMPTY_STYLE,
  keyPointOnSelectedPathLineStyle: EMPTY_STYLE,
  pathNavigatorStyle: {
    initRotateDegree: 0,
    width: 16,
    height: 16,
    autoRotate: true,
    lineJoin: 'round',
    content: 'defaultPathNavigator',
    pathLinePassedStyle: {
      lineWidth: 0,
      borderStyle: null,
      strokeStyle: 'transparent',
      dirArrowStyle: false,
    },
  },
};

export const AirLine = {
  mixins: [MapMixin],

  props: {
    points: {
      type: Array,
      required: true,
      validator (val) {
        // 至少保证有2个点
        return val.length > 1;
      },
    },
    edges: {
      type: Array,
      default: () => [],
      validator (val) {
        // 边必须有起点(source)和终点(target)信息
        return _.every(
          val,
          edge => (_.hasIn(edge, 'source') && _.hasIn(edge, 'target')),
        );
      },
    },
    // 需要绘制从这些点出去的所有线
    outPoints: {
      type: Array,
      default: () => [],
    },
    // 需要绘制进入这些点的所有边
    inPoints: {
      type: Array,
      default: () => [],
    },
    // 设定曲线的曲率，值越大越弯曲，0为直线
    curvature: {
      type: Number,
      default: 1,
    },

    pieceCount: {
      type: Number,
      default: 20,
      validator (val) {
        return val > 0;
      },
    },
  },

  data () {
    return {
      pointMarkers: [],
      edgesGroup: null,
      pathSimplifier: null,
    };
  },

  computed: {
    toBeDrawnEdges () {
      return _.filter(this.edges, (edge) => {
        const { source, target } = edge;
        return _.findIndex(this.outPoints, point => point.id === source) > -1
            || _.findIndex(this.inPoints, point => point.id === target) > -1;
      });
    },
  },

  watch: {
    toBeDrawnEdges () {
      if (this.map && typeof AMapUI !== 'undefined') {
        this.clearPathSimplifier();
        this.renderPathSimplifierIfReady();
      }
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderPoints();
    },

    sourceReadyFunc () {
      this.renderPathSimplifierIfReady();
    },

    renderPathSimplifierIfReady () {
      if (typeof AMapUI === 'undefined') {
        window.console.error(`AMapUI not found:
          airline component required AMapUI
          please set use-map-ui property on base-map
        `);
      } else {
        AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
          if (!PathSimplifier.supportCanvas) {
            return window.console.error('当前环境不支持 Canvas！');
          }
          this.renderPathSimplifier(PathSimplifier);
        });
      }
    },

    renderPathSimplifier (PathSimplifier) {
      const pathSimplifier = new PathSimplifier({
        zIndex: 100,
        map: this.map,
        autoSetFitView: false,
        getPath: pathData => pathData.path,
        renderOptions: DEFAULT_RENDER_OPTIONS,
      });
      pathSimplifier.setData(_.map(this.toBeDrawnEdges, (edge, index) => (
        {
          name: `路线${index + 1}`,
          path: this._getCurvePoints(edge),
        }
      )));
      _.forEach(this.toBeDrawnEdges, (_edge, index) => {
        pathSimplifier.createPathNavigator(index, {
          loop: true,
          speed: 1000000,
        }).start();
      });
      this.pathSimplifier = pathSimplifier;
    },

    renderPoints () {
      this.pointMarkers = _.map(this.points, (point) => {
        const circle = new AMap.CircleMarker({
          center: point.position,
          radius: 5,
          strokeColor: 'white',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: 'rgba(0,0,255,1)',
          fillOpacity: 0.5,
          bubble: true,
          cursor: 'pointer',
          clickable: true,
        });
        circle.on('click', () => this.$emit('point-clicked', point));
        circle.setMap(this.map);
        return circle;
      });
    },

    clearPathSimplifier () {
      if (this.pathSimplifier) {
        this.pathSimplifier.setData();
        this.pathSimplifier = null;
      }
    },

    clearPoints () {
      _.forEach(this.pointMarkers, (circle) => {
        circle.setMap(null);
      });
      this.pointMarkers = [];
    },

    clear () {
      this.clearPoints();
      this.clearPathSimplifier();
    },

    _getPointsByEdge (edge) {
      const { source, target } = edge;
      const sourcePoint = _.find(this.points, point => point.id === source);
      const targetPoint = _.find(this.points, point => point.id === target);
      return [
        sourcePoint.position,
        targetPoint.position,
      ];
    },
    _getCurvePoints (edge) {
      const [start, end] = this._getPointsByEdge(edge),
            result = [],
            sign = (end[0] - start[0]) * (end[1] - start[1]) > 0 ? -1 : 1,
            lengthx = Math.abs(start[0] - end[0]),
            lengthy = Math.abs(start[1] - end[1]),
            length = Math.max(lengthx, lengthy),
            modulus = this.curvature * length * 0.4;
      while (result.length <= this.pieceCount) {
        const i = result.length,
              lamda = i / this.pieceCount,
              delta = modulus * (0.25 - ((0.5 - lamda) ** 2)),
              deltaX = lengthx >= lengthy ? 0 : delta,
              // 使得 deltaX,deltaY 有且一定只有一个等于 delta
              deltaY = delta - deltaX;
        result.push([
          (start[0] * (1 - lamda)) + (end[0] * lamda) + (sign * deltaX),
          (start[1] * (1 - lamda)) + (end[1] * lamda) + deltaY,
        ]);
      }
      return result;
    },
  },
};

export default AirLine;
</script>
