<template>
  <div>
    <MglGeojsonLayer
      :sourceId="clusterOptions.name"
      layerId="cluster"
      :layer="geoJsonlayer" />
    <MglGeojsonLayer
      :sourceId="clusterOptions.name"
      layerId="clusterCount"
      :layer="clusterCountLayer" />
    <MglGeojsonLayer
      :sourceId="clusterOptions.name"
      layerId="unclusteredPoint"
      :layer="unclusterCountLayer" />
  </div>
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";
import _ from "lodash";

export default {
  name: "VCluster",
  components: {
    MglGeojsonLayer
  },
  props: {
    map: {
      type: Object,
      default: null
    },
    clusterOptions: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      geoJsonlayer: null,
      clusterCountLayer: null,
      unclusterCountLayer: null
    }
  },
  created () {
    this.addSource();
    this.drawGeoJsonlayer();
    this.drawClusterCountLayer();
    this.drawUnclusterCountLayer();
  },
  methods: {
    addSource () {
      this.map.addSource(this.clusterOptions.name, {
        type: "geojson",
        cluster: true,
        data: this.clusterOptions.data,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })
    },
    drawGeoJsonlayer () {
      let range = _.sortBy(this.clusterOptions.style.range, function(item) { item.level } );
      let color_range = this.parsePaintOptions(range, "color");
      let radius_range = this.parsePaintOptions(range, "size");
      this.geoJsonlayer =
      {
        id: "clusters",
        type: "circle",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            ...color_range
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            ...radius_range
          ]
        }
      }
    },
    parsePaintOptions (range, key) {
      let option = _.reduce(range, function(memo, item){
        if(item.max){
          memo.push(item[key], item.max);
        }else{
          memo.push(item[key]);
        }
        return memo;
      }, []);
      return option;
    },
    drawClusterCountLayer () {
      this.clusterCountLayer = {
        id: "clusterCount",
        type: "symbol",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      }
    },
    drawUnclusterCountLayer () {
      this.unclusterCountLayer = {
        type: "circle",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      }
    }
  }
}
</script>
<style>

</style>
