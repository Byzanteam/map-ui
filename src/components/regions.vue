<template>
  <div />
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

export default {
  inject: ['instance'],

  computed: {
    map () {
      return this.instance.map;
    },
  },

  watch: {
    map () {
      this.creatRegion();
    },
  },

  methods: {
    creatRegion () {
      const opts = {
        subdistrict: 0,
        extensions: 'all',
        level: 'city',
      };
      this.renderGeojson();
      const district = new AMap.DistrictSearch(opts);
      district.search('中国', (status, result) => {
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
    },

    creatPolyline (bound) {
      return new AMap.Polyline({
        path: bound,
        strokeColor: '#99ffff',
        strokeWeight: 4,
        map: this.map,
      });
    },

    renderGeojson () {
      axios
        .get('https://vanppo.me/trash/coods.geojson')
        .then(({ data }) => {
          const geojson = new AMap.GeoJSON({
            geoJSON: data.features,
            getPolygon: (json, lnglats) => new AMap.Polygon({
              path: lnglats,
              strokeColor: 'white',
              strokeStyle: 'dashed',
              strokeDasharray: [5, 10],
              strokeWeight: 2,
            }),
          });
          geojson.setMap(this.map);
        });
    },
  },
};
</script>

<style>

</style>
