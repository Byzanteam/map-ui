const PROFILE =  {
  parameter: {
    center: [104.0723, 30.602836],
    accessToken: 'pk.eyJ1IjoiYmlnZGF0YWNkIiwiYSI6ImNqbjFkcW00ZTI4cGszd3J1Njk2aDg5Z2gifQ.0WBA8a87guYK9b4Tf3je5A',
    style: 'mapbox://styles/bigdatacd/cjwkdexlu0a6a1cmn15f93irz/draft',
    zoom: 5,
    background: 'https://apod.nasa.gov/apod/image/1804/MilkyVlei_Liebermann_4000.jpg',
    layers: {
      marker: {
        name: 'marker',
        data: [
          {
            properties: {
              message: '北京拓维启通科技有限公司',
              iconSize: [60, 60],
            },
            geometry: {
              type: 'Point',
              coordinates: [104.223, 30.782836],
            },
          },
          {
            properties: {
              message: '阿里巴巴有限公司',
              iconSize: [50, 50],
            },
            geometry: {
              type: 'Point',
              coordinates: [104.1182, 30.692846],
            },
          },
          {
            properties: {
              message: '腾讯大厦',
              iconSize: [40, 40],
            },
            geometry: {
              type: 'Point',
              coordinates: [104.1753, 30.63263],
            },
          },
          {
            properties: {
              message: '银泰in99',
              iconSize: [40, 40],
            },
            geometry: {
              type: 'Point',
              coordinates: [104.1073, 30.608766],
            },
          },
          {
            properties: {
              message: '银泰in55',
              iconSize: [40, 40],
            },
            geometry: {
              type: 'Point',
              coordinates: [104.9973, 31.608766],
            },
          },
          {
            properties: {
              message: '银泰in66',
              iconSize: [40, 40],
            },
            geometry: {
              type: 'Point',
              coordinates: [117.1073, 31.808766],
            },
          },
          {
            properties: {
              message: '银泰in77',
              iconSize: [40, 40],
            },
            geometry: {
              type: 'Point',
              coordinates: [108.9893, 30.697766],
            },
          },
          {
            properties: {
              message: '银泰in33',
              iconSize: [40, 40],
            },
            geometry: {
              type: 'Point',
              coordinates: [105.7673, 31.908766],
            },
          },
        ],
        style: {
          icon: 'circle',
          color: '#ce2c69',
          size: 10,
          animation: 'Ripples',
        },
        events: {
          'mouseenter': 'popupOpen',
          'mouseleave': 'popupClose'
        },
      },
      clusters: {
        name: 'earthquakes',
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        clusterRadius: 50,
        style: {
          type: '',
          range: [
            {
              'level': 1,
              'max': 1,
              'color': '#55d2e1',
              'size': 10,
            },
            {
              'level': 2,
              'max': 100,
              'color': '#51bbd6',
              'size': 20,
            },
            {
              'level': 3,
              'max': 750,
              'color': '#f1f075',
              'size': 30,
            },
            {
              'level': 4,
              'max': null,
              'color': '#f28cb1',
              'size': 40,
            },
          ],
        },
        events: {
          'click': 'clusterClick',
        },
      },
      regions: {
        name: 'regions',
        data: 'https://raw.githubusercontent.com/ufoe/d3js-geojson/master/china/china.json',
        elements: {
          outline: {
            name: 'china',
            style: {
              type: 'line',
              color: '#006d2c',
              width: 2,
              opacity: 1,
              dasharray: [2, 2],
            },
            events: {
              'click': 'hightlight',
            },
          },
          background: {
            name: 'chinaFill',
            style: {
              color: '#006d2c',
              opacity: 0.3,
            },
            events: {
              'click': 'hightlight',
            },
          },
          highlight: {
            outline: {
              name: 'highlightLine',
              style: {
                type: 'line',
                color: 'burlywood',
                width: 2,
                opacity: 1,
                dasharray: [2, 2],
              },
              events: {
                'click': 'hightlight',
              },
            },
            background: {
              name: 'highlight',
              style: {
                color: 'aqua',
                opacity: 0.3,
              },
              events: {
                'click': 'hightlight',
              },
            },
          },
        },
      },
    },
  },
  out_variable: ['_$currentMarker', '_$currentCluster'],
};

export default PROFILE;
