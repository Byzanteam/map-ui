import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

// 导入组件库
import './styles/index.scss';

new Vue({
  render: h => h(App),
}).$mount('#app')
