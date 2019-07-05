<template>
  <div />
</template>

<script>
import _ from 'lodash';

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
  },
};
</script>

<style>

</style>
