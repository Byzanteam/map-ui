<template>
  <div />
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

const SIDE_OPTIONS = {
  strokeColor: '#5fd0dc',
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
        return {
          fillColor: 'blue',
          strokeColor: 'red',
        };
      },
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
          // 描边
          this.creatPolyline(bound);
        });
        this.map.setMask(mask);
      });
      this.renderGeojson();
    },

    creatPolyline (bound) {
      return new AMap.Polyline({
        path: bound,
        map: this.map,
        ...(_.assign(SIDE_OPTIONS, this.sideOptions)),
      });
    },

    renderGeojson () {
      axios
        .get(this.regionsUrl)
        .then(({ data }) => {
          const geojson = new AMap.GeoJSON({
            geoJSON: data.features,
            getPolygon: (json, lnglats) => {
              const options = _.assign(POLYGON_OPTIONS, this.polygonOptions);
              const polygon =  new AMap.Polygon({
                path: lnglats,
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
          });
          geojson.setMap(this.map);
        });
    },
  },
};
</script>
