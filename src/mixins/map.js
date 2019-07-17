export default {
  inject: ['registerCbs'],

  data () {
    return {
      map: null,
    };
  },

  watch: {
    map () {
      this.mapLoadedFunc();
    },
  },

  created () {
    this.registerCbs('mapCreated', (map) => {
      this.map = map;
    });
  },

  methods: {
    mapLoadedFunc () {},
  },

  render () {
    return null;
  },
};
