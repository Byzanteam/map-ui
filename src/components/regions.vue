<script>
import _ from 'lodash';

const DEFAULT_AREA_STYLE = {
        strokeColor: 'white',
        strokeDasharray: [5, 10],
        fillColor: '#5fd0dc',
        fillOpacity: 0.7,
        strokeWeight: 1,
      },
      DEFAULT_AREA_HOVER_STYLE = {
        strokeColor: 'white',
        strokeDasharray: [5, 10],
        fillColor: '#666666',
        fillOpacity: 0.7,
        strokeWeight: 1,
      };

export default {
  inject: ['instance'],

  props: {
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
    areaStyle: {
      type: Object,
      default: () => ({}),
    },
    areaHoverStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      geoJSONAreas: [],
    };
  },

  computed: {
    map () {
      return this.instance.map;
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
        const group = this._getGroupByCode(adcode);
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

  // response data props change
  watch: {
    groupedGeoJSON () {
      if (this.map) {
        this.renderGeoJSON();
      }
    },
  },

  watch: {
    map () {
      this.mapLoadedFunc();
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderGeoJSON();
    },

    renderGeoJSON () {
      this.clear();
      this.geoJSONAreas = _.map(this.groupedGeoJSON, (geoJSON) => {
        const { areaStyle, areaHoverStyle } = this._getGeoJSONStyle(geoJSON);
        const geojson = new AMap.GeoJSON({
          geoJSON,
          getPolygon: (_json, lnglats) => this._generatePolygon(lnglats),
        });
        geojson.setOptions(areaStyle);
        geojson.on('click', () => this.$emit('area-clicked', geoJSON));
        geojson.on('mouseover', () => geojson.setOptions(areaHoverStyle));
        geojson.on('mouseout', () => geojson.setOptions(areaStyle));
        geojson.setMap(this.map);
        return geojson;
      });
    },

    clear () {
      _.forEach(this.geoJSONAreas, area => area.clearOverlays());
      this.geoJSONAreas = [];
    },

    _generatePolygon (lnglats) {
      return new AMap.Polygon({
        path: lnglats,
        zIndex: 100,
      });
    },
    _getGroupByCode (adcode) {
      if (_.isEmpty(this.groups)) return null;
      return _.find(
        this.groups,
        ({ codes }) => _.includes(codes, adcode),
      );
    },
    _getGeoJSONStyle (geoJSON) {
      const [feature] = geoJSON.features,
            { adcode, style, hoverStyle } = feature.properties,
            group = this._getGroupByCode(adcode);
      if (group) {
        return this.__getAreaStyle(group.style, group.hoverStyle);
      }
      return this.__getAreaStyle(style, hoverStyle);
    },
    __getAreaStyle (style = {}, hoverStyle = {}) {
      return {
        areaStyle: {
          ...DEFAULT_AREA_STYLE,
          ...this.areaStyle,
          ...style,
        },
        areaHoverStyle: {
          ...DEFAULT_AREA_HOVER_STYLE,
          ...this.areaHoverStyle,
          ...hoverStyle,
        },
      };
    },
  },

  render () {
    return null;
  },
};
</script>
