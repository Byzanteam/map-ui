<template>
  <div>
    <el-regions
      v-for="feature in features"
      :key="feature.properties.id"
      :source="feature"
      :regionsOptions="regionsOptions"
      :mapOn="mapOn" />
  </div>
</template>

<script>
import axios from 'axios';
import Regions from "./regions";

export default {
  components: {
    "el-regions": Regions
  },
  props: {
    mapOn: {
      type: Function,
      required: true,
    },
    mapGetSource: {
      type: Function,
      required: true,
    },
    mapAddSource:  {
      type: Function,
      required: true,
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
        let source = this.mapGetSource(source_id);
        if(!source){
          this.mapAddSource(source_id, {
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
