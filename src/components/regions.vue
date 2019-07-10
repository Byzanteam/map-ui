<script>
import _ from 'lodash';

const SIDE_OPTIONS = {
  strokeColor: '#5fd0dc',
  fillColor: '#5fd0dc',
  strokeWeight: 1,
  strokeOpacity: 0.2,
};

const POLYGON_OPTIONS = {
  strokeColor: 'white',
  strokeDasharray: [5, 10],
  fillColor: '#5fd0dc',
  fillOpacity: 0.7,
  strokeWeight: 1,
};

export default {
  inject: ['instance'],

  props: {
    maskArea: {
      type: String,
      default: '中国',
    },
    labelData: {
      type: Array,
      default: () => ([]),
    },
    geoJson: {
      type: Object,
      default: () => ({
        type: 'FeatureCollection',
        features: [],
      }),
    },
    customArea: {
      type: Array,
      default: () => ([]),
    },
    sideOptions: {
      type: Object,
      default: () => ({}),
    },
    polygonOptions: {
      type: Object,
      default: () => ({}),
    },
    hoveredPolygonOptions: {
      type: Object,
      default () {
        return {
          fillColor: '#ffffff',
          fillOpacity: 0.3,
        };
      },
    },
  },

  data () {
    return {
      polygons: {},
    };
  },

  computed: {
    map () {
      return this.instance.map;
    },
  },

  watch: {
    map () {
      this.renderMask();
    },
  },

  methods: {
    renderMask () {
      const district = new AMap.DistrictSearch({
        //  显示下级行政区级数，0表示不返回下级行政区
        subdistrict: 0,
        //  返回行政区边界坐标等具体信息
        extensions: 'all',
        //  关键字对应的行政区级别，country表示国家
        level: 'country',
      });
      district.search(this.maskArea, (status, result) => {
        const { boundaries } = result.districtList[0];
        const mask = _.map(boundaries, (bound) => {
          // 底图描边
          this.creatPolyline(bound);
          return [bound];
        });
        this.map.setMask(mask);
      });
      this.renderGeojson();
    },

    creatPolyline (bound) {
      return new AMap.Polygon({
        path: bound,
        map: this.map,
        ...SIDE_OPTIONS,
        ...this.sideOptions,
      });
    },

    renderGeojson () {
      const options = {
        ...POLYGON_OPTIONS,
        ...this.polygonOptions,
      };
      const geojson = new AMap.GeoJSON({
        geoJSON: this.geoJson,
        getPolygon: (json, lnglats) => {
          const area = _.find(this.customArea, item => _.includes(
            item.codes,
            json.properties.adcode
          ));
          if (area) {
            return this.classifyArea(options, lnglats, area);
          }
          return this.generatePolygon(options, lnglats);
        },
      });
      geojson.setMap(this.map);
      this.renderLabel();
    },

    classifyArea (options, lnglats, area) {
      let current_polygons = this.polygons[area.name];
      if (!current_polygons) {
        current_polygons = [];
      }
      const custom_area_options = {
        zIndex: 100,
        ...options,
        ...area.options,
      };
      const polygon = new AMap.Polygon({
        path: lnglats,
        ...custom_area_options,
      });
      current_polygons.push(polygon);
      this.polygons[area.name] = current_polygons;

      // 多边形mouseover时找到与它同组的所有多边形，同时高亮，mouseout时同时失去高亮
      polygon.on('mouseover', () => {
        _.each(current_polygons, (item) => {
          item.setOptions(this.hoveredPolygonOptions);
        });
      });
      polygon.on('mouseout', () => {
        _.each(current_polygons, (item) => {
          item.setOptions(custom_area_options);
        });
      });
      return polygon;
    },

    generatePolygon (options, lnglats) {
      const polygon = new AMap.Polygon({
        path: lnglats,
        zIndex: 100,
        ...options,
      });
      polygon.on('mouseover', () => polygon.setOptions(this.hoveredPolygonOptions));
      polygon.on('mouseout', () => polygon.setOptions(options));
      return polygon;
    },

    renderLabel () {
      const layer = new AMap.LabelsLayer({
        zIndex: 200,
      });
      this.map.add(layer);
      _.each(this.labelData, (label) => {
        const labelsMarker = new AMap.LabelMarker(label);
        layer.add(labelsMarker);
      });
    },
  },

  render () {
    return null;
  },
};
</script>
