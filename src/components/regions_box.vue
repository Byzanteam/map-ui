<template>
  <div>
    <el-regions-layer
      v-for="feature in features"
      :key="feature.properties.id"
      :source="feature"
      :regionsOptions="regionsOptions"
      :map="map" />
  </div>
</template>

<script>
import axios from 'axios';
import RegionsLayer from "./regions_layer";

export default {
  components: {
    "el-regions-layer": RegionsLayer
  },
  props: {
    map: {
      type: Object,
      default () {
        return null;
      }
    },
    regionsOptions: {
      type: Object,
      default () {
        return null;
      }
    }
  },
  data () {
    return {
      features: [],
    }
  },
  mounted () {
    this.parseGeojson();
  },
  methods: {
    parseGeojson() {
      axios
      .get(this.regionsOptions.data)
      .then(response => {
        this.features = response.data.features;
        this.addSource();
      });
    },
    addSource(){
      _.each(this.features, (feature) => {
        let source_id = feature.properties.id;
        let source = this.map.getSource(source_id);
        if(!source){
          this.map.addSource(source_id, {
            type: "geojson",
            data: feature
          })
        }
      })
    },
  }
}
</script>

<style>

</style>
