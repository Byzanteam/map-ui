<template>
  <MglGeojsonLayer
    :sourceId="clusterOptions.name"
    :layerId="geoJsonlayer.id"
    :layer="geoJsonlayer" />
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";
import mapboxgl from "mapbox-gl";
import _ from "lodash";

export default {
  name: "Cluster",
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
      sourceId: "",
      geoJsonlayer: null,
      markers: {},
      markersOnScreen: {},
    }
  },
  created () {
    this.addSource();
    this.drawGeoJsonlayer();
    this.updateMarkers();
  },
  methods: {
    addSource () {
      this.sourceId = this.clusterOptions.name
      this.map.addSource(this.sourceId, {
        type: "geojson",
        cluster: true,
        data: this.clusterOptions.data,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
    },
    drawGeoJsonlayer () {
      let point = _.find(this.clusterOptions.style.range, function(item) { return item.level == 1 });
      this.geoJsonlayer = {
        'id': `${this.clusterOptions.name}_circle`,
        'type': 'circle',
        'source': this.sourceId,
        'filter': ['!=', 'cluster', true],
        'paint': {
          'circle-color': point.color,
          'circle-radius': point.size,
        }
      }
    },
    updateMarkers() {
      let newMarkers = {};
      let features = this.map.querySourceFeatures(this.sourceId);

      for (let i = 0; i < features.length; i++) {
        let coords = features[i].geometry.coordinates;
        let props = features[i].properties;
        if (!props.cluster) continue;
          let id = props.cluster_id;

        let marker = this.markers[id];
        if (!marker) {
          let el = this.createClusterCircle(props);
          marker = this.markers[id] = new mapboxgl.Marker({ element: el }).setLngLat(coords);
        }
        newMarkers[id] = marker;

        if (!this.markersOnScreen[id])
          marker.addTo(this.map);
      }
      _.each(this.markersOnScreen, (item, id) => {
        if (!newMarkers[id])
          this.markersOnScreen[id].remove();
      })
      this.markersOnScreen = newMarkers;
      this.map.on('data', (e) => {
        if (e.sourceId !== this.sourceId || !e.isSourceLoaded) return;
        this.map.on('move', this.updateMarkers);
        this.map.on('moveend', this.updateMarkers);
        this.updateMarkers();
      });
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
      let html = `<div class="animation-wrapper">
                    <div class="circle" style="width: ${size}px; height: ${size}px; background: ${color}">
                      ${total.toLocaleString()}
                    </div>
                    <span style="width: ${size}px; height: ${size}px; background: ${color};"></span>
                  </div>`;
      let el = document.createElement('div');
      el.innerHTML = html;
      return el.firstChild;
    }
  }
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
