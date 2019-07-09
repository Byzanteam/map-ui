<template>
  <div />
</template>

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
          // 第一级区域描边
          this.creatPolyline(bound);
        });
        this.map.setMask(mask);
      });
      this.renderGeojson();
      this.renderLabel();
    },

    creatPolyline (bound) {
      return new AMap.Polyline({
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
        geoJSON: GEOJSON,
        getPolygon: (json, lnglats) => {
          if (this.customArea) {
            const area = _.find(
              CUSTOM_AREA, item => _.includes(item.codes, json.properties.code)
            );
            return this.classifyArea(area, options, lnglats);
          }
          return this.generatePolygon(json, options, lnglats);
        },
      });
      geojson.setMap(this.map);
    },

    classifyArea (area, options, lnglats) {
      const polygon = new AMap.Polygon({
        path: lnglats,
        zIndex: 100,
        ...options,
        ...area.options,
      });
      polygon.on('mouseover', () => {
        polygon.setOptions(this.hoveredPolygonOptions);
      });
      polygon.on('mouseout', () => {
        polygon.setOptions(options);
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
};
</script>
