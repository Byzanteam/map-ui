<template>
  <base-map
    :map-options="{
      zoom: 4
    }"
    use-map-ui
  >
    <cluster
      :cluster-style-map="clusterStyleMap"
      :label-style="clusterLabelStyle"
      :cluster-content="clusterContent"
    >
      <stratum-marker
        :markers="pointData"
      />
      <stratum-marker
        :markers="pointData2"
      />
    </cluster>
  </base-map>
</template>

<script>
import _ from 'lodash';
import BaseMap from '../../src/components/map.vue';
import Cluster from '../../src/components/cluster';
import StratumMarker from '../../src/components/marker/stratum_marker';
import cities from './cities';

export default {
  components: {
    BaseMap,
    Cluster,
    StratumMarker,
  },

  data () {
    return {
      markerContent: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
      clusterLabelStyle: {
        fontSize: 14,
        fontWeight: 100,
      },
      clusterStyleMap: [
        {
          limit: 1,
          color: 'red',
          size: 5,
          type: 'circle',
          borderColor: 'rgba(138, 210, 155, 1)',
          labelStyle: {
            color: 'purple',
          },
        },
        {
          limit: 2,
          color: '#dc7626',
          size: 5,
          type: 'circle',
          borderColor: 'rgba(138, 210, 155, 1)',
          labelStyle: {
            color: 'purple',
          },
        },
        {
          limit: 5,
          color: '#891ba0',
          size: 10,
          type: 'circle',
          borderColor: 'rgba(120, 140, 125, 1)',
          labelStyle: {
            fontSize: 14,
            color: 'blue',
          },
        },
        {
          limit: 10,
          color: '#1967ab',
          size: 15,
          type: 'circle',
          borderColor: 'rgba(189, 145, 215, 1)',
          labelStyle: {
            fontSize: 16,
            color: 'red',
          },
        },
        {
          limit: 20,
          color: '#1496ab',
          size: 20,
          type: 'circle',
          borderColor: 'rgba(189, 215, 205, 1)',
          labelStyle: {
            fontSize: 18,
            color: '#fff',
          },
        },
      ],
    };
  },

  computed: {
    pointData2 () {
      return _.map(this.pointData, (point) => {
        const point2 = {
          location: [point.location[0] + 0.3, point.location[1] + 0.2],
          value: point.value,
          label: point.label,
        };
        return point2;
      });
    },
    pointData () {
      return _.map(cities, item => ({
        location: item.lnglat,
        ...item,
      }));
    },
  },

  methods: {
    clusterContent  (context) {
      const node = `<div
        style='width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: red;
        border: 3px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        line-height: 40px'>
          ${context.count}
        </div>`;
      context.marker.setContent(node);
    },
  },
};
</script>
