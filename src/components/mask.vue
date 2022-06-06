<script>
import MapMixin from '../mixins/map';

const DEFAULT_AREA_STYLE = {
  strokeColor: '#00eeff',
  strokeWeight: 1,
  fillColor: '#71B3ff',
  fillOpacity: 0.5,
};

export const Mask = {
  mixins: [MapMixin],

  props: {
    area: {
      type: Object,
      required: true,
    },
    areaStyle: {
      type: Object,
      default: () => {},
    },
  },

  watch: {
    area (value) {
      this.setMask(value);
    },
  },

  methods: {
    mapLoadedFunc () {
      this.setMask(this.area);
    },

    setMask (data) {
      this.clear();
      this.renderMask(data);
    },

    renderMask (data) {
      let holes;

      const shape = new AMap.GeoJSON({
        geoJSON: data,
        getPolygon: (_json, lnglats) => {
          [holes] = lnglats;
        },
      });

      const outer = [
        new AMap.LngLat(-360, 90, true),
        new AMap.LngLat(-360, -90, true),
        new AMap.LngLat(360, -90, true),
        new AMap.LngLat(360, 90, true),
      ];

      const pathArray = [outer, holes];
      const polygon = new AMap.Polygon({
        ...DEFAULT_AREA_STYLE,
        ...this.areaStyle,
      });
      this.instance = polygon;
      polygon.setPath(pathArray);
      this.map.add(polygon);


      console.log(shape);
    },

    show () {
      this.instance.show();
    },

    hide () {
      this.instance.hide();
    },

    setZIndexNumber (value) {
      if (this.instance) {
        this.instance.setzIndex(value);
      }
    },

    clear () {
      if (this.instance) {
        this.map.remove(this.instance);
      }
      this.instance = null;
    },
  },
};

export default Mask;
</script>
