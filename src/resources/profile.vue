<script>
export default {
  parameter: {
    center: [104.0723, 30.602836],
    accessToken: "pk.eyJ1IjoiYmlnZGF0YWNkIiwiYSI6ImNqbjFkcW00ZTI4cGszd3J1Njk2aDg5Z2gifQ.0WBA8a87guYK9b4Tf3je5A",
    style: "mapbox://styles/bigdatacd/cjwkdexlu0a6a1cmn15f93irz/draft",
    zoom: 5,
    background: "https://apod.nasa.gov/apod/image/1804/MilkyVlei_Liebermann_4000.jpg",
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
        elements: {
          outline: {
            name: "china",
            style: {
              type: "line",
              color: "#006d2c",
              width: 2,
              opacity: 1,
              dasharray: [2, 2]
            },
            events: {
              "click": "highlight"
            }
          },
          background: {
            name: "chinaFill",
            style: {
              color: "#006d2c",
              opacity: 0.3,
            },
            events: {
              "click": "highlight"
            }
          },
          highlight: {
            outline: {
              name: "highlightLine",
              style: {
                type: "line",
                color: "burlywood",
                width: 2,
                opacity: 1,
                dasharray: [2, 2]
              },
              events: {
                "click": "highlight"
              }
            },
            background: {
              name: "highlight",
              style: {
                color: "aqua",
                opacity: 0.3,
              },
              events: {
                "click": "highlight"
              }
            },
          }
        }
      }
    }
  },
  out_variable: ["_$currentMarker", "_$currentCluster"]
};
</script>
