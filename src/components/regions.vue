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
    mergedPolygonOptions () {
      return {
        ...POLYGON_OPTIONS,
        ...this.polygonOptions,
      };
    },
  },

  watch: {
    map () {
      this.renderMask();
    },
  },

  methods: {
    renderMask () {
      this.map.plugin(['AMap.DistrictSearch'], () => {
        const district = new AMap.DistrictSearch({
        //  显示下级行政区级数，0表示不返回下级行政区
          subdistrict: 0,
          //  返回行政区边界坐标等具体信息
          extensions: 'all',
          //  关键字对应的行政区级别，country表示国家
          level: 'country',
        });
        district.search(this.maskArea, (status, result) => {
          const mask = _.map(result.districtList[0].boundaries, (bound) => {
          // 底图描边
            this.creatPolyline(bound);
            return [bound];
          });
          this.map.setMask(mask);
        });
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
      const geojson = new AMap.GeoJSON({
        geoJSON: this.geoJson,
        getPolygon: (json, lnglats) => {
          const area = _.find(this.customArea, item => _.includes(
            item.codes,
            json.properties.adcode
          ));
          if (area) {
            return this.generateAreaPolygon(lnglats, area);
          }
          return this.generatePolygon(lnglats);
        },
      });
      geojson.setMap(this.map);
      this.renderLabel();
    },

    generateAreaPolygon (lnglats, area) {
      const custom_area_options = {
        zIndex: 100,
        ...this.mergedPolygonOptions,
        ...area.options,
      };
      const polygon = new AMap.Polygon({
        path: lnglats,
        ...custom_area_options,
      });
      this.classifyArea(polygon, area);
      // 多边形mouseover时找到与它同组的所有多边形，同时高亮，mouseout时同时失去高亮
      polygon.on('mouseover', () => {
        this.animation(
          this.polygons[area.name],
          this.hoveredPolygonOptions,
          custom_area_options
        );
      });
      polygon.on('mouseout', () => {
        this.animation(
          this.polygons[area.name],
          custom_area_options,
          this.hoveredPolygonOptions
        );
        _.each(this.polygons[area.name], (item) => {
          item.setOptions(this.hoveredPolygonOptions);
        });
      });
      polygon.on('mouseout', () => {
        _.each(this.polygons[area.name], (item) => {
          item.setOptions(custom_area_options);
        });
      });
      return polygon;
    },

    classifyArea (polygon, area) {
      let current_polygons = this.polygons[area.name];
      if (!current_polygons) {
        current_polygons = [];
      }
      current_polygons.push(polygon);
      this.polygons[area.name] = current_polygons;
    },

    generatePolygon (lnglats) {
      const polygon = new AMap.Polygon({
        path: lnglats,
        zIndex: 100,
        ...this.mergedPolygonOptions,
      });
      polygon.on('mouseover', () => polygon.setOptions(this.hoveredPolygonOptions));
      polygon.on('mouseout', () => polygon.setOptions(this.mergedPolygonOptions));
      return polygon;
    },

    renderLabel () {
      const layer = new AMap.LabelsLayer({
        zIndex: 200,
      });
      this.map.add(layer);
      _.each(this.labelData, (label) => {
        layer.add(new AMap.LabelMarker(label));
      });
    },

    animation: _.debounce((polygon, new_options, old_options) => {
      const new_opacity = new_options.fillOpacity * 10;
      const old_opacity = old_options.fillOpacity * 10;
      const opacity_range = (new_opacity - old_opacity);
      let opacity_value = old_opacity;
      const animationTimer = setInterval(() => {
        if (opacity_range > 0) {
          opacity_value += 1;
        } else {
          opacity_value -= 1;
        }
        const options = {
          ...new_options,
          fillOpacity: opacity_value / 10,
        };
        if (_.isArray(polygon)) {
          _.each(polygon, (item) => {
            item.setOptions(options);
          });
        } else {
          polygon.setOptions(options);
        }
        if (opacity_value === new_opacity) {
          clearInterval(animationTimer);
        }
      }, 200 / opacity_range);
    }),
  },

  render () {
    return null;
  },
};
</script>
