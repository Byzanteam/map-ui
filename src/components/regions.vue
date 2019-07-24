<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

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

export const Regions = {
  mixins: [MapMixin],

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

  data () {
    return {
      geoJSONAreas: [],
    };
  },

  computed: {
    groupedGeoJSON () {
      if (_.isEmpty(this.groups)) {
        return _.map(this.areas, area => ({
          type: 'FeatureCollection',
          features: [area],
        }));
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
        this.clear();
        this.renderGeoJSON();
      }
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderGeoJSON();
    },

    renderGeoJSON () {
      this.geoJSONAreas = _.map(this.groupedGeoJSON, (geoJSON) => {
        const { areaStyle, areaHoverStyle } = this._getGeoJSONStyle(geoJSON);
        const geojson = new AMap.GeoJSON({
          geoJSON,
          getPolygon: (_json, lnglats) => this._generatePolygon(lnglats),
        });
        geojson.setOptions(areaStyle);
        geojson.on('click', () => (
          this.$emit('area-clicked', geoJSON, geojson, this)
        ));
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

    setFitView (area) {
      if (this.map) {
        this.map.setFitView(area);
      }
    },

    _generatePolygon (lnglats) {
      return new AMap.Polygon({
        path: lnglats,
      });
    },
    _getGroupByCode (code) {
      if (_.isEmpty(this.groups)) return null;
      return _.find(this.groups, (group) => {
        const { codes } = group;
        return _.findIndex(codes, i => String(i) === String(code)) >= 0;
      });
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
};

export default Regions;
</script>
