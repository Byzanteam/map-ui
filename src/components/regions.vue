<script>
import _ from 'lodash';

const LABEL_DATA = require('../../source/label.json');
const GEOJSON = require('../../source/regions.json');
const CUSTOM_AREA = require('../../source/custom_area.json');

const SIDE_OPTIONS = {
  strokeColor: '#5fd0dc',
  fillColor: '#5fd0dc',
  strokeWeight: 3,
  strokeOpacity: 0.9,
};

const POLYGON_OPTIONS = {
  strokeColor: 'white',
  strokeDasharray: [5, 10],
  fillColor: '#5fd0dc',
  fillOpacity: 0.9,
  strokeWeight: 1,
};

export default {
  inject: ['instance'],

  props: {
    regionsUrl: {
      type: String,
      default: '',
    },
    labelDataUrl: {
      type: String,
      default: '',
    },
    maskArea: {
      type: String,
      default: '中国',
    },
    sideOptions: {
      type: Object,
      default () {
        return {};
      },
    },
    polygonOptions: {
      type: Object,
      default () {
        return {};
      },
    },
    hoveredPolygonOptions: {
      type: Object,
      default () {
        return {};
      },
    },
    customArea: {
      type: Boolean,
      default: false,
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
      const opts = {
        subdistrict: 0,
        extensions: 'all',
        level: 'country',
      };
      const district = new AMap.DistrictSearch(opts);
      district.search(this.maskArea, (status, result) => {
        const bounds = result.districtList[0].boundaries;
        const mask = [];
        _.each(bounds, (bound) => {
          mask.push([bound]);
          // 底图描边
          this.creatPolyline(bound);
        });
        this.map.setMask(mask);
      });
      this.renderGeojson();
      this.renderLabel();
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
      // 配置的多边形样式和默认的多边形样式合并
      const options = {
        ...POLYGON_OPTIONS,
        ...this.polygonOptions,
      };
      const geojson = new AMap.GeoJSON({
        geoJSON: GEOJSON,
        getPolygon: (json, lnglats) => {
          const area = _.find(
            CUSTOM_AREA, item => _.includes(
              item.codes,
              json.properties.adcode
            )
          );
          if (area) {
            return this.classifyArea(area, options, lnglats);
          }
          return this.generatePolygon(json, options, lnglats);
        },
      });
      geojson.setMap(this.map);
    },

    classifyArea (area, options, lnglats) {
      let current_polygons = this.polygons[area.name];
      // 初始化自定义区块多边形数组
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

    generatePolygon (json, options, lnglats) {
      const polygon = new AMap.Polygon({
        path: lnglats,
        zIndex: 100,
        ...options,
      });
      polygon.on('mouseover', () => {
        polygon.setOptions(this.hoveredPolygonOptions);
      });
      polygon.on('mouseout', () => {
        polygon.setOptions(options);
      });
      return polygon;
    },

    renderLabel () {
      const layer = new AMap.LabelsLayer({
        zIndex: 200,
      });
      this.map.add(layer);
      _.each(LABEL_DATA, (label) => {
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
