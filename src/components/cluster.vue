<template>
  <mgl-geojson-layer
    :source-id="sourceId"
    :layer-id="geoJsonlayer.id"
    :layer="geoJsonlayer"
  />
</template>

<script>
import { MglGeojsonLayer } from 'vue-mapbox';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';

export default {
  name: 'Cluster',
  components: {
    MglGeojsonLayer,
  },
  props: {
    mapApi: {
      type: Function,
      required: true,
    },
    clusterOptions: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      sourceId: '',
      geoJsonlayer: null,
      markers: {},
      markersOnScreen: {},
    };
  },
  created () {
    this.addSource();
  },
  methods: {
    addSource () {
      const { name, data, clusterRadius } = this.clusterOptions;
      this.sourceId = name;
      this.mapApi('addSource', [
        this.sourceId,
        {
          type: 'geojson',
          cluster: true,
          data,
          clusterRadius,
        },
      ]);
      this.drawGeoJsonlayer();
    },
    drawGeoJsonlayer () {
      const point = _.minBy(
        this.clusterOptions.style.range, item => item.level
      );

      const { color, size } = point;
      this.geoJsonlayer = {
        id: `${this.sourceId}_circle`,
        type: 'circle',
        source: this.sourceId,
        paint: {
          'circle-color': color,
          'circle-radius': size,
        },
      };
      this.bindEvents();
    },
    updateMarkers () {
      const newMarkers = {};
      const features = this.mapApi('querySourceFeatures', [this.sourceId]);
      _.each(features, (feature) => {
        const props = feature.properties;
        if (!props.cluster) return;

        const id = props.cluster_id;
        let marker = this.markers[id];
        if (!marker) {
          const el = this.createClusterCircle(props);
          const new_marker = new mapboxgl.Marker({ element: el });
          this.markers[id] = new_marker.setLngLat(feature.geometry.coordinates);
          marker = this.markers[id];
        }
        newMarkers[id] = marker;

        if (!this.markersOnScreen[id]) {
          this.$emit('addMarker', marker);
        }
      });
      _.each(this.markersOnScreen, (marker, marker_id) => {
        if (!newMarkers[marker_id]) {
          this.markersOnScreen[marker_id].remove();
        }
      });
      this.markersOnScreen = newMarkers;
    },
    bindEvents () {
      this.mapApi('on', [
        'data',
        (e) => {
          if (e.sourceId !== this.sourceId || !e.isSourceLoaded) return;
          this.mapApi('on', ['move', this.updateMarkers]);
          this.mapApi('on', ['moveend', this.updateMarkers]);
          this.updateMarkers();
        },
      ]);

      _.forOwn(this.clusterOptions.events, (funcName, event) => {
        this.mapApi('on', [event, this.geoJsonlayer.id, this[funcName]]);
      });
    },
    clusterClick (e) {
      const features = this.mapApi('queryRenderedFeatures', [
        e.point,
        { layers: [this.geoJsonlayer.id] },
      ]);
      return features;
    },
    createClusterCircle (props) {
      const total = props.point_count;
      const range = _.sortBy(
        this.clusterOptions.style.range, item => item.level
      );

      const option = _.find(range, (item, index) => {
        switch (index) {
          case 0:
            return;
          case range.length - 1:
            return item;
          default:
            return total >= range[index - 1].max && total < item.max;
        }
      });
      const { size, color } = option;
      const html = `<div class='animation-wrapper'>
                    <div class='circle' style='width: ${size}px; height: ${size}px; background: ${color}'>
                      ${total.toLocaleString()}
                    </div>
                    <span class="animation-ripples" style='width: ${size}px; height: ${size}px; background: ${color};'></span>
                  </div>`;
      const el = document.createElement('div');
      el.innerHTML = html;
      return el;
    },
  },
};
</script>
