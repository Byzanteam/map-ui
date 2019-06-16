<template>
  <MglGeojsonLayer />
</template>

<script>
import { MglGeojsonLayer } from "vue-mapbox";
import mapboxgl from "mapbox-gl";
import _ from "lodash";

export default {
  name: "HtmlCluster",
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
      markers: {},
      markersOnScreen: {},
    }
  },
  created () {
    this.map.addSource('earthquakes', {
      "type": "geojson",
      "data": "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
      "cluster": true,
      "clusterRadius": 80,
    });
    this.map.addLayer({
      "id": "earthquake_circle",
      "type": "circle",
      "source": "earthquakes",
      "filter": ["!=", "cluster", true],
      "paint": {
        "circle-color": "#55d2e1",
        "circle-radius": 8,
      }
    });
    this.updateMarkers();
  },
  methods: {
    addSource () {
      this.map.addSource(this.clusterOptions.name, {
        type: "geojson",
        cluster: true,
        data: this.clusterOptions.data,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
    },
    updateMarkers() {
      let newMarkers = {};
      let features = this.map.querySourceFeatures('earthquakes');

      for (let i = 0; i < features.length; i++) {
        let coords = features[i].geometry.coordinates;
        let props = features[i].properties;
        if (!props.cluster) continue;
          let id = props.cluster_id;

        let marker = this.markers[id];
        if (!marker) {
          let el = this.createDonutChart(props);
          marker = this.markers[id] = new mapboxgl.Marker({element: el}).setLngLat(coords);
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
        if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) return;
        this.map.on('move', this.updateMarkers);
        this.map.on('moveend', this.updateMarkers);
        this.updateMarkers();
      });
    },
    createDonutChart(props) {
      let total = props.point_count;
      let fontSize = total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
      let w = total >= 1000 ? 100 : total >= 100 ? 64 : total >= 10 ? 48 : 36;
      let html = `<div class="animation-wrapper"><div class="circle" style="font-size: ${fontSize}; width: ${w}px; height: ${w}px; background: #55d2e1"">${total.toLocaleString()}</div><span style="width: ${w}px; height: ${w}px; background: #55d2e1;"></span></div>`;
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
