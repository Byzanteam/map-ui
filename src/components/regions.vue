<script>
import _ from 'lodash';

const SIDE_OPTIONS = {
  strokeColor: '#5fd0dc',
  fillColor: '#5fd0dc',
  strokeWeight: 1,
  strokeOpacity: 0.2,
};

const POLYGON_OPTIONS = {
  strokeColor: 'white',
  strokeDasharray: [5, 10],
  fillColor: '#5fd0dc',
  fillOpacity: 0.7,
  strokeWeight: 1,
};
const POLYGON_OPTIONS_HOVER = {
  strokeColor: 'white',
  strokeDasharray: [5, 10],
  fillColor: '#666666',
  fillOpacity: 0.7,
  strokeWeight: 1,
};

export default {
  inject: ['instance'],

  props: {
    labelData: {
      type: Array,
      default: () => [],
    },
    // Feature GeoJSON Array
    areas: {
      type: Array,
      default: () => [],
    },
    // groups
    groups: {
      type: Array,
      default: () => [],
    },
    sideOptions: {
      type: Object,
      default: () => ({}),
    },
    polygonOptions: {
      type: Object,
      default: () => ({}),
    },
    hoveredPolygonOptions: {
      type: Object,
      default () {
        return {
          fillColor: '#ffffff',
          fillOpacity: 0.3,
        };
      },
    },
  },

  data () {
    return {
      polygons: {},
    };
  },

  computed: {
    map () {
      return this.instance.map;
    },
    mergedPolygonOptions () {
      return {
        ...POLYGON_OPTIONS,
        ...this.polygonOptions,
      };
    },
    groupedGeoJSON () {
      if (_.isEmpty(this.groups)) {
        return [{
          type: 'FeatureCollection',
          features: this.areas,
        }];
      }
      const groups = _.groupBy(this.areas, (item) => {
        const { adcode, name } = item.properties;
        const group = _.find(
          this.groups,
          ({ codes }) => _.includes(codes, adcode),
        );
        if (group) return group.name;
        return name;
      });
      return _.transform(groups, (acc, value) => {
        acc.push({
          type: 'FeatureCollection',
          features: value,
        });
      }, []);
    },
  },

  watch: {
    map () {
      this.mapLoadedFunc();
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderGeojson();
      // this.renderLabel();
    },

    creatPolyline (bound) {
      return new AMap.Polygon({
        path: bound,
        map: this.map,
        ...SIDE_OPTIONS,
        ...this.sideOptions,
      });
    },

    renderGeojson () {
      _.forEach(this.groupedGeoJSON, (geoJSON) => {
        const geojson = new AMap.GeoJSON({
          geoJSON,
          getPolygon: (_json, lnglats) => this.generatePolygon(lnglats),
        });
        geojson.on('mouseover', () => geojson.setOptions(POLYGON_OPTIONS_HOVER));
        geojson.on('mouseout', () => geojson.setOptions(POLYGON_OPTIONS));
        geojson.setMap(this.map);
      });
    },

    generatePolygon (lnglats) {
      return new AMap.Polygon({
        path: lnglats,
        zIndex: 100,
        ...this.mergedPolygonOptions,
      });
    },

    renderLabel () {
      const layer = new AMap.LabelsLayer({
        zIndex: 200,
      });
      this.map.add(layer);
      _.each(this.labelData, (label) => {
        layer.add(new AMap.LabelMarker(label));
      });
    },
  },

  render () {
    return null;
  },
};
</script>
