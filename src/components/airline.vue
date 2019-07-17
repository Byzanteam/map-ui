<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

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
      if (this.map) {
        this.clearEdges();
        this.renderEdges();
      }
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderPoints();
      this.renderEdges();
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

    renderEdges () {
      const edges = _.map(this.toBeDrawnEdges, edge => (
        new AMap.Polyline({
          path: this._getCurvePoints(edge),
          strokeColor: '#3366FF',
          strokeOpacity: 1,
          strokeWeight: 2,
          // 折线样式还支持 'dashed'
          strokeStyle: 'solid',
          lineJoin: 'round',
          lineCap: 'round',
        })
      ));
      this.edgesGroup = new AMap.OverlayGroup(edges);
      this.edgesGroup.setMap(this.map);
    },

    clearPoints () {
      _.forEach(this.pointMarkers, (circle) => {
        circle.setMap(null);
      });
      this.pointMarkers = [];
    },

    clearEdges () {
      this.edgesGroup.clearOverlays();
    },

    clear () {
      this.clearPoints();
      this.clearEdges();
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
