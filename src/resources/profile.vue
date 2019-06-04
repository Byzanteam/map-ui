<script>
export default {
  parameter: {
    center: [104.0723, 30.602836],
    style: "mapbox://styles/mapbox/dark-v10",
    zoom: 5,
    layers: {
      marker: {
        name: "marker",
        data: [
          {
            properties: {
              message: "Foo",
              iconSize: [60, 60]
            },
            geometry: {
              type: "Point",
              coordinates: [104.223, 30.782836]
            }
          },
          {
            properties: {
              message: "Bar",
              iconSize: [50, 50]
            },
            geometry: {
              type: "Point",
              coordinates: [104.1182, 30.692846]
            }
          },
          {
            properties: {
              message: "Baz",
              iconSize: [40, 40]
            },
            geometry: {
              type: "Point",
              coordinates: [104.1753, 30.63263]
            }
          },
          {
            properties: {
              message: "lili",
              iconSize: [40, 40]
            },
            geometry: {
              type: "Point",
              coordinates: [104.1073, 30.608766]
            }
          }
        ],
        style: {
          img: "url",
          colors: ["#ce2c69", "#ffffff"],
          size: 100,
          type: "",
          animation: "wave"
        }
      },
      clusters: {
        name: "clusters",
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
      },
      regions: {
        name: "regions",
        data:
          "https://raw.githubusercontent.com/ufoe/d3js-geojson/master/china/china.json",
        style: {
          outline: {
            type: "line",
            color: "",
            opacity: 0.2
          },
          background: {
            color: "#ce2c69",
            opacity: 0.3
          },
          highlight: {
            type: "line",
            "background-color": "",
            "line-color": "",
            opacity: 0.2
          }
        }
      }
    }
  },
  out_variable: ["_$currentMarker", "_$currentCluster"]
};
</script>
