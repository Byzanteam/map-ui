<template>
  <div />
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

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
        return {
          strokeColor: '#5fd0dc',
          strokeWeight: 3,
        };
      },
    },
    polygonOptions: {
      type: Object,
      default () {
        return {
          strokeColor: 'white',
          strokeStyle: 'dashed',
          strokeDasharray: [5, 10],
          fillColor: '#5fd0dc',
          strokeWeight: 1,
        };
      },
    },
    polylineOptions: {
      type: Object,
      default () {
        return {
          strokeColor: '#5fd0dc',
          strokeWeight: 1,
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
        for (let i = 0; i < bounds.length; i += 1) {
          mask.push([bounds[i]]);
        }
        this.map.setMask(mask);
        // 描边
        _.each(bounds, (bound) => {
          this.creatPolyline(bound);
        });
      });
      this.renderGeojson();
    },

    creatPolyline (bound) {
      return new AMap.Polyline({
        path: bound,
        map: this.map,
        ...this.sideOptions,
      });
    },

    renderGeojson () {
      axios
        .get(this.regionsUrl)
        .then(({ data }) => {
          const geojson = new AMap.GeoJSON({
            geoJSON: data.features,
            getPolygon: (json, lnglats) => new AMap.Polygon({
              path: lnglats,
              ...this.polygonOptions,
            }),
            getPolyline: (json, lnglats) => new AMap.Polyline({
              path: lnglats,
              ...this.polylineOptions,
            }),
          });
          geojson.setMap(this.map);
        });
    },
  },
};
</script>
