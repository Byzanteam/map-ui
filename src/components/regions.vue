<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const DEFAULT_AREA_STYLE = {
        strokeColor: 'white',
        fillColor: '#5fd0dc',
        fillOpacity: 0.2,
        strokeWeight: 1,
      },
      DEFAULT_AREA_HOVER_STYLE = {
        fillOpacity: 1,
        strokeWeight: 2,
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
          properties: area.properties,
        }));
      }
      const groups = _.groupBy(this.areas, (item) => {
        const { adcode } = item.properties;
        const group = this._getGroupByCode(adcode);
        if (group) return group.codes.join(',');
        return `${adcode}`;
      });
      return _.transform(groups, (acc, value) => {
        const group = this._getGroupByCode(value[0].properties.adcode);
        acc.push({
          type: 'FeatureCollection',
          features: value,
          properties: {
            group,
          },
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
      _.forEach(this.geoJSONAreas, (area) => {
        area.setMap(null);
        area.clearOverlays();
      });
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
        return _.findIndex(codes, i => `${i}` === `${code}`) >= 0;
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
        // hover 的样式默认继承正常的样式
        areaHoverStyle: {
          ...DEFAULT_AREA_STYLE,
          ...this.areaStyle,
          ...style,
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
