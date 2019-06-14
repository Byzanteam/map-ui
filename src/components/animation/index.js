import Vue from "vue";
import _ from "lodash";
import Ripples from "./ripples.vue";

const components = {
  Ripples,
};

export default {
  init () {
    _.forOwn(components, (component, componentName) => {
      Vue.component(componentName, component);
    });
  },
};
