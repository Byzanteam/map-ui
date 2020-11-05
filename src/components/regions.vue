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
    selectable: {
      type: Boolean,
      default: true,
    },

    multipleSelect: {
      type: Boolean,
      default: false,
    },

    zIndex: {
      type: Number,
      default: 10,
    },
  },

  data () {
    // 频繁交互可能导致卡顿，因为一个 area 的数据结构大且深
    // 优化的时候可以考虑简化结构或者 seletedAreas 不被监视
    return {
      selectedAreas: [],
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

    selectedAreas () {
      _.forEach(this.selectedAreas, (item) => {
        const { areaHoverStyle } = this._getGeoJSONStyle(item.geoJSON);
        item.shape.setOptions(areaHoverStyle);
      });
    },
  },

  created () {
    this.geoJSONAreas = [];
  },

  methods: {
    mapLoadedFunc () {
      this.renderGeoJSON();
    },

    renderGeoJSON () {
      this.geoJSONAreas = _.map(this.groupedGeoJSON, (geoJSON) => {
        const { areaStyle, areaHoverStyle } = this._getGeoJSONStyle(geoJSON);
        const shape = new AMap.GeoJSON({
          geoJSON,
          getPolygon: (_json, lnglats) => this._generatePolygon(lnglats),
        });
        shape.setOptions(areaStyle);
        shape.on('click', () => this._areaClicked(shape, geoJSON));
        shape.on('mouseover', () => shape.setOptions(areaHoverStyle));
        shape.on('mouseout', () => this._areaMouseout(shape, areaStyle));
        shape.setMap(this.map);
        return { shape, geoJSON };
      });
    },

    selectArea (area) {
      const geoJSONArea = this._findArea(area);
      if (!this._isSelected(geoJSONArea)) {
        this._selectArea(geoJSONArea);
      }
    },

    unselectArea (area) {
      const geoJSONArea = this._findArea(area);
      const old_index = _.findIndex(
        this.selectedAreas,
        item => geoJSONArea === item,
      );
      if (old_index > -1) {
        const { areaStyle } = this._getGeoJSONStyle(geoJSONArea.geoJSON);
        this.selectedAreas.splice(old_index, 1);
        geoJSONArea.shape.setOptions(areaStyle);
      }
    },

    unselectAll () {
      _.forEach(this.selectedAreas, ({ geoJSON, shape }) => {
        shape.setOptions(this._getGeoJSONStyle(geoJSON).areaStyle);
      });
      this.selectedAreas = [];
    },

    toggleSelectArea (area) {
      const geoJSONArea = this._findArea(area);
      if (this._isSelected(geoJSONArea)) {
        this.unselectArea(geoJSONArea);
      } else {
        this._selectArea(geoJSONArea);
      }
    },

    clear () {
      _.forEach(this.geoJSONAreas, ({ shape }) => {
        shape.setMap(null);
        shape.clearOverlays();
      });
      this.geoJSONAreas = [];
      this.unselectAll();
    },

    setFitView (area) {
      if (this.map) {
        this.map.setFitView(area);
      }
    },

    _selectArea (area) {
      if (this.multipleSelect) {
        this.selectedAreas.push(area);
      } else {
        if (this.selectedAreas.length) {
          const { geoJSON, shape } = this.selectedAreas[0];
          shape.setOptions(this._getGeoJSONStyle(geoJSON).areaStyle);
        }
        this.selectedAreas = [area];
      }
    },
    _isSelected (area) {
      return _.includes(this.selectedAreas, area);
    },
    _areaClicked (area, geoJSON) {
      if (this.selectable) {
        this.toggleSelectArea(this._findAreaByShape(area));
      }
      this.$emit('area-clicked', geoJSON, area, this);
    },
    _areaMouseout (area, style) {
      if (this._isSelected(this._findAreaByShape(area))) return;
      area.setOptions(style);
    },
    _findArea (area) {
      return area instanceof AMap.GeoJSON
        ? this._findAreaByShape(area)
        : area;
    },
    _findAreaByShape (area) {
      return _.find(this.geoJSONAreas, item => item.shape === area);
    },
    _generatePolygon (lnglats) {
      return new AMap.Polygon({
        path: lnglats,
        zIndex: this.zIndex,
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
