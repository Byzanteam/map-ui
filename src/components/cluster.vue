<template>
  <MglGeojsonLayer
    :sourceId="clusterOptions.name"
    :layerId="geoJsonlayer.id"
    :layer="geoJsonlayer" />
</template>

<script>
import { MglGeojsonLayer } from 'vue-mapbox';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';

export default {
  name: 'Cluster',
  components: {
    MglGeojsonLayer
  },
  props: {
    mapApi: {
      type: Function,
      required: true,
    },
    clusterOptions: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      sourceId: '',
      geoJsonlayer: null,
      markers: {},
      markersOnScreen: {},
    }
  },
  created () {
    this.addSource();
  },
  methods: {
    addSource () {
      this.sourceId = this.clusterOptions.name;
      this.mapApi('addSource', [
        this.sourceId,
        {
          type: 'geojson',
          cluster: true,
          data: this.clusterOptions.data,
          clusterRadius: this.clusterOptions.clusterRadius,
        }]
      );
      this.drawGeoJsonlayer();
    },
    drawGeoJsonlayer () {
      let point = _.find(this.clusterOptions.style.range, function(item) { return item.level == 1 });
      this.geoJsonlayer = {
        'id': `${this.sourceId}_circle`,
        'type': 'circle',
        'source': this.sourceId,
        'paint': {
          'circle-color': point.color,
          'circle-radius': point.size,
        }
      };
      this.bindEvents();
    },
    updateMarkers() {
      let newMarkers = {};
      let features = this.mapApi('querySourceFeatures', [this.sourceId]);
      _.each(features, (feature) => {
        let coords = feature.geometry.coordinates;
        let props = feature.properties;
        if (!props.cluster) return;

        let id = props.cluster_id;
        let marker = this.markers[id];
        if (!marker) {
          let el = this.createClusterCircle(props);
          marker = this.markers[id] = new mapboxgl.Marker({ element: el }).setLngLat(coords);
        }
        newMarkers[id] = marker;

        if (!this.markersOnScreen[id])
          this.$emit('addMarker', marker);
      });
      _.each(this.markersOnScreen, (marker, marker_id) => {
        if (!newMarkers[marker_id])
          this.markersOnScreen[marker_id].remove();
      })
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
        }
      ]);
      _.forOwn(this.clusterOptions.events, (funcName, event) => {
        this.mapApi("on", [event, this.geoJsonlayer.id, this[funcName]]);
      });
    },
    ClusterClick (e) {
      let features = this.mapApi('queryRenderedFeatures', [
        e.point,
        { layers: [this.geoJsonlayer.id] }
      ]);
      return (e, features);
    },
    createClusterCircle(props) {
      let total = props.point_count;
      let range = _.sortBy(this.clusterOptions.style.range, function(item) {
        return item.level
      });
      let option = _.find(range, function(item, index) {
        switch(index) {
          case 0:
            return;
          case range.length - 1:
            return item;
          default:
            return total >= range[index - 1].max && total < item.max;
        }
      });
      let size = option.size
      let color = option.color;
      let html = `<div class='animation-wrapper'>
                    <div class='circle' style='width: ${size}px; height: ${size}px; background: ${color}'>
                      ${total.toLocaleString()}
                    </div>
                    <span style='width: ${size}px; height: ${size}px; background: ${color};'></span>
                  </div>`;
      let el = document.createElement('div');
      el.innerHTML = html;
      return el.firstChild;
    },
  },
}
</script>

<style>
  @keyframes ripples {
    0%{
      opacity: .2;
      transform: scale(1);
    }
    40%{
      opacity: .3;
      transform: scale(1.4);
    }
    60%{
      opacity: .2;
      transform: scale(1.6);
    }
    80%{
      opacity: .1;
      transform: scale(1.8);
    }
    100%{
      opacity: 0;
      transform: scale(2);
    }
  }

	.animation-wrapper {
		background-position: 0 0;
		border-radius: 50%;
		position: relative;
  }

  .animation-wrapper .circle {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .animation-wrapper span {
    animation: ripples 2s linear infinite;
    border-radius: 50%;
    bottom: 0;
    left: 0;
    opacity: .1;
    position: absolute;
    z-index: -1;
  }

</style>
