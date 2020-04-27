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
    width: 8,
    height: 8,
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
    /**
     * {
     *    source: source_node_id,
     *    target: target_node_id,
     *    value: 20, // 边权重
     * }
     */
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
    /**
     * 节点应该包含所有边的起止点，可以有冗余
     * {
     *    id: 23,
     *    position: [lng, lat], // 节点位置
     *    value: 100, // 节点权重
     * }
     */
    points: {
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
        return val > 0 && Number.isInteger(val);
      },
    },
    // 用完成时间来定义速度
    duration: {
      type: Number,
      // unit: 秒(s)
      default: 10,
      validator (val) {
        return val > 0;
      },
    },
    density: {
      type: Number,
      default: 5,
      validator (val) {
        return val > 0 && Number.isInteger(val);
      },
    },
    // 每隔多少时间发射一次
    frequency: {
      type: Number,
      // unit: 秒(s)
      default: 2,
      validator (val) {
        return val > 0;
      },
    },
    airLineOptions: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      pointMarkers: [],
      edgesGroup: null,
      pathSimplifier: null,
      batchTimer: null,
      batch: {
        tasks: [],
        counter: 0,
      },
      airLineStyle: this.airLineOptions,
    };
  },

  computed: {
    groupedEdgesByStartPoint () {
      return _.groupBy(this.edges, edge => edge.source);
    },

    airLineRenderOptions () {
      return {
        ...DEFAULT_RENDER_OPTIONS,
        ...this.airLineStyle,
      };
    },
  },

  watch: {
    groupedEdgesByStartPoint () {
      if (this.map && typeof AMapUI !== 'undefined') {
        this.clearPathSimplifier();
        this.renderPathSimplifierIfReady();
      }
    },
    'batch.tasks': function (val) {
      if (_.isEmpty(val)) {
        clearTimeout(this.batchTimer);
        this.batchTimer = null;
      } else {
        this.batchTimer = this._createBatchTimer();
      }
    },
    airLineOptions: {
      deep: true,
      handler (val) {
        this.airLineStyle = {
          ...val,
        };
        this.clearPathSimplifier();
        this.renderPathSimplifierIfReady();
      },
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderPoints();
    },

    sourceReadyFunc () {
      this.renderPathSimplifierIfReady();
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
      this.map.setFitView(this.pointMarkers);
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
      this.pathSimplifier = new PathSimplifier({
        zIndex: 111,
        map: this.map,
        autoSetFitView: false,
        getPath: pathData => pathData.path,
        renderOptions: this.airLineRenderOptions,
      });
      this.pathSimplifier.setData(_.map(this.edges, (edge, i) => (
        {
          name: `路线${i + 1}`,
          path: this._getCurvePoints(edge),
        }
      )));
      this.startNavigate();
    },

    startNavigate () {
      _.forEach(this.groupedEdgesByStartPoint, (edges) => {
        this._requestBatchTasks(edges);
        this._batchNavigate(edges);
      });
      this.batch.counter += 1;
    },

    clearPathSimplifier () {
      if (this.pathSimplifier) {
        this.batch = {
          tasks: [],
          counter: 0,
        };
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

    _batchNavigate (navs) {
      const { counter } = this.batch,
            { density } = this,
            offset = density * (counter % Math.ceil(navs.length / density)),
            edges = navs.slice(offset, offset + density);
      _.forEach(edges, (edge) => {
        const pathNavigator = this._renderPathNavigator(edge);
        pathNavigator.on('move', () => {
          // remove cursor when cursor at path end
          if (pathNavigator.isCursorAtPathEnd()) {
            pathNavigator.destroy();
          }
        });
        pathNavigator.start();
      });
    },

    _requestBatchTasks (edges) {
      this.batch.tasks.push(edges);
    },

    _createBatchTimer () {
      if (this.batchTimer) clearTimeout(this.batchTimer);
      return setTimeout(this._executeBatchTasks, this.frequency * 1000);
    },

    _executeBatchTasks () {
      const { tasks } = this.batch;
      _.forEach(tasks, (task) => {
        this._batchNavigate(task);
      });
      this.batch.counter += 1;
      this.batchTimer = this._createBatchTimer();
    },

    _renderPathNavigator (edge) {
      const index = _.findIndex(this.edges, edge);
      /**
       * createPathNavigator(index, options)
       * index 需要与 pathSimplifier 的 data 索引相同
       */
      return this.pathSimplifier.createPathNavigator(index, {
        loop: false,
        speed: this._getSpeed(edge),
      });
    },

    _getEdgePoints (edge) {
      const { source, target } = edge,
            sourcePoint = _.find(this.points, point => point.id === source),
            targetPoint = _.find(this.points, point => point.id === target);
      if (sourcePoint && targetPoint) {
        return [
          sourcePoint.position,
          targetPoint.position,
        ];
      }
      throw new Error(`params error:
        points not includes ${edge.source} or ${edge.target}
      `);
    },

    _getCurvePoints (edge) {
      const [start, end] = this._getEdgePoints(edge),
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

    _getPathLength (edge) {
      const [start, end] = this._getEdgePoints(edge);
      return AMap.GeometryUtil.distance(start, end);
    },

    _getSpeed (edge) {
      const length = this._getPathLength(edge);
      // 1m/s = 3.6km/h
      return 3.6 * (length / this.duration);
    },
  },

  beforeDestroy () {
    this.clear();
  },
};

export default AirLine;
</script>
