<script>
import ClusterMarker from './marker/custom_marker';

// const DEFAULT_PATH_STYLE = {
//   map: this.map,
//   // path: lineArr,
//   showDir: true,
//   strokeColor: '#28F',
//   strokeOpacity: 1,
//   strokeWeight: 6,
//   strokeStyle: 'solid',
// };
//
// const DEFAULT_PASSED_PATH_STYLE = {
//   map: this.map,
//   // path: lineArr,
//   strokeColor: '#28F',
//   strokeOpacity: 1,
//   strokeWeight: 6,
//   strokeStyle: 'solid',
// };

export const pathReplay = {
  mixins: [ClusterMarker],

  props: {
    path: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    mapLoadedFunc () {
      this.setMarkerData(this.marker);
      this.renderLine();
      this.renderPassedLine();
      // setInterval(this.startAnimation, 1000);
      this.startAnimation();
    },

    renderLine () {
      this.lineInstane = new AMap.Polyline({
        path: this.path,
        strokeWeight: 24,
        // borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: '#A8FBC0', // 线条颜色
        strokeOpacity: 0.6,
        lineJoin: 'round', // 折线拐点连接处样式
      });

      this.map.add(this.lineInstane);
    },
    renderPassedLine () {
      this.passedLineInstane = new AMap.Polyline({
        strokeWeight: 24,
        // borderWeight: 4, // 线条宽度，默认为 1
        strokeColor: '#A8FBC0', // 线条颜色
        strokeOpacity: 0.6,
        lineJoin: 'round', // 折线拐点连接处样式
      });

      this.map.add(this.passedLineInstane);
    },
    setMarkerData (data) {
      this.clear();
      this.renderMarker(data);
    },
    renderMarker (marker) {
      this.instance = new AMap.Marker({
        ...this.options,
        position: new AMap.LngLat(marker.point[0], marker.point[1]),
        content: this.content,
        offset: new AMap.Pixel(this.offset[0], this.offset[1]),
        extData: marker,
        anchor: this.anchor,
        zIndex: this.zIndex,
      });

      this.instance.on('click', e => this.$emit('marker-clicked', e));
      this.instance.on('mouseover', e => this.$emit('marker-mouseover', e));
      this.instance.on('mouseout', e => this.$emit('marker-mouseout', e));
      this.instance.on('moving', e => this.passedLineInstane.setPath(e.passedPath));
      this.$emit('marker-rendered', this.instance);

      this.map.add(this.instance);
    },
    startAnimation () {
      console.log(this.instance);
      this.instance.moveAlong(this.path, 18000, k => k, true);
    },
    pauseAnimation () {
      this.instance.pauseMove();
    },
    resumeAnimation () {
      this.instance.resumeMove();
    },
    stopAnimation () {
      this.instance.stopMove();
    },

    clear () {
      if (this.instance) {
        this.map.remove(this.instance);
      }
      this.instance = null;
    },
  },
};

export default pathReplay;
</script>
