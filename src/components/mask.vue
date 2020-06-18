<script>
import MapMixin from '../mixins/map';

export const MapMask = {
  mixins: [MapMixin],

  props: {
    maskStyle: {
      type: Object,
      default: () => {},
    },
    area: {
      type: Array,
      required: true,
    },
  },

  methods: {
    sourceReadyFunc () {
      this.renderGeoJSON();
    },
    renderGeoJSON () {
      AMap.plugin('AMap.DistrictSearch', () => {
        // 外多边形坐标数组和内多边形坐标数组
        const outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true),
        ];

        const pathArray = [
          outer,
        ];
        pathArray.push(...this.area);
        const polygon = new AMap.Polygon({
          pathL: pathArray,
          strokeColor: '#00eeff',
          strokeWeight: 1,
          fillColor: '#71B3ff',
          fillOpacity: 0.5,
          ...this.maskStyle,
        });
        polygon.setPath(pathArray);
        this.map.add(polygon);
      });
    },
  },
};

export default MapMask;
</script>
