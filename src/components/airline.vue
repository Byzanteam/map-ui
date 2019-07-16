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
        const { source } = edge;
        return _.findIndex(this.outPoints, point => point.id === source) > -1;
      });
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderPoints();
      this.renderEdges();
    },

    renderPoints () {
      this.pointMarkers = _.map(this.points, (point) => {
        const { lng, lat } = point;
        const circle = new AMap.CircleMarker({
          center: [lng, lat],
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
      const edges = _.map(this.toBeDrawnEdges, (edge) => {
        const path = this._getPointsByEdge(edge);
        return new AMap.Polyline({
          path,
          strokeColor: '#3366FF',
          strokeOpacity: 1,
          strokeWeight: 2,
          // 折线样式还支持 'dashed'
          strokeStyle: 'solid',
          lineJoin: 'round',
          lineCap: 'round',
        });
      });
      this.edgesGroup = new AMap.OverlayGroup(edges);
      this.edgesGroup.setMap(this.map);
    },

    clearPoints () {
      _.forEach(this.pointMarkers, (circle) => {
        circle.hide();
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
        [sourcePoint.lng, sourcePoint.lat],
        [targetPoint.lng, targetPoint.lat],
      ];
    },
  },
};

export default AirLine;
</script>
