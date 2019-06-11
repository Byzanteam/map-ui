import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 导入组件库
import './styles/index.scss';
import AnimationComponents from "./components/animation_components";

AnimationComponents.init();

new Vue({
  render: h => h(App),
}).$mount('#app')
