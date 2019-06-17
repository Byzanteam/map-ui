<template>
  <div class="region-wrapper">
    <region
      v-for="feature in features"
      :key="feature.properties.id"
      :source="feature"
      :regions-options="regionsOptions"
      :map-on="mapOn" />
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import Region from './region';

export default {
  components: {
    Region,
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
      default: null,
    },
  },
  data () {
    return {
      features: [],
    };
  },
  created () {
    this.parseGeojson();
  },
  methods: {
    parseGeojson () {
      axios
      .get(this.regionsOptions.data)
      .then(response => {
        this.features = response.data.features;
        this.addSource();
      });
    },
    addSource () {
      _.each(this.features, (feature) => {
        let source_id = feature.properties.id;
        if(!this.mapGetSource(source_id)) {
          this.mapAddSource(source_id, {
            type: 'geojson',
            data: feature,
          });
        }
      });
    },
  },
}
</script>
