export default {
  inject: ['instance'],

  computed: {
    map () {
      return this.instance.map;
    },
  },

  watch: {
    map () {
      this.mapLoadedFunc();
    },
  },

  methods: {
    mapLoadedFunc () {},
  },

  render () {
    return null;
  },
};
