export default {
  inject: ['registerCbs'],

  data () {
    return {
      map: null,
    };
  },

  watch: {
    map () {
      this.mapLoadedFunc && this.mapLoadedFunc();
    },
  },

  created () {
    this.registerCbs('mapCreated', (map) => {
      this.map = map;
    });
    if (this.sourceReadyFunc) {
      this.registerCbs('sourceReady', () => {
        this.sourceReadyFunc();
      });
    }
  },

  render () {
    return null;
  },
};
