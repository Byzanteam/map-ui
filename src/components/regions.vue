<script>
import _ from 'lodash';
import MapMixin from '../mixins/map';

const DEFAULT_BOUNDARY_STYLE = {
        strokeColor: '#5fd0dc',
        fillColor: '#5fd0dc',
        strokeWeight: 1,
        strokeOpacity: 0.2,
      },
      DEFAULT_AREA_STYLE = {
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
    boundaryLine: {
      type: Object,
      default: null,
      validator (val) {
        return !val || val.path;
      },
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

  computed: {
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
    bonudaryLineStyle () {
      if (this.boundaryLine && this.boundaryLine.style) {
        return {
          ...DEFAULT_BOUNDARY_STYLE,
          ...this.boundaryLine.style,
        };
      }
      return DEFAULT_BOUNDARY_STYLE;
    },
  },

  methods: {
    mapLoadedFunc () {
      this.renderGeoJSON();
      this.renderBoundaryLine();
      this.renderLabel();
    },

    renderBoundaryLine () {
      if (this.boundaryLine) {
        return new AMap.Polygon({
          path: this.boundaryLine.path,
          map: this.map,
          ...DEFAULT_BOUNDARY_STYLE,
          ...this.boundaryLine.style,
        });
      }
    },

    renderGeoJSON () {
      _.forEach(this.groupedGeoJSON, (geoJSON) => {
        const { areaStyle, areaHoverStyle } = this._getGeoJSONStyle(geoJSON);
        const geojson = new AMap.GeoJSON({
          geoJSON,
          getPolygon: (_json, lnglats) => this.generatePolygon(lnglats),
        });
        geojson.setOptions(areaStyle);
        geojson.on('click', () => this.$emit('area-clicked', geoJSON));
        geojson.on('mouseover', () => geojson.setOptions(areaHoverStyle));
        geojson.on('mouseout', () => geojson.setOptions(areaStyle));
        geojson.setMap(this.map);
      });
    },

    generatePolygon (lnglats) {
      return new AMap.Polygon({
        path: lnglats,
        zIndex: 100,
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
};

export default Regions;
</script>
