<template>
  <div class="region-wrapper">
    <region
      v-for="feature in features"
      :key="feature.properties.id"
      :source="feature"
      :regions-options="regionsOptions"
      :map-api="mapApi" />
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
    mapApi: {
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
        const source_id = feature.properties.id;
        if (!this.mapApi('getSource', [source_id])) {
          this.mapApi('addSource', [
            source_id,
            {
              type: 'geojson',
              data: feature,
            },
          ]);
        }
      });
    },
  },
};
</script>
