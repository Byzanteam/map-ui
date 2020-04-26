import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/marker',
    },
    { path: '/marker', component: () => import('./components/marker') },
    { path: '/elastic_marker', component: () => import('./components/elastic_marker') },
    { path: '/regions', component: () => import('./components/regions') },
    { path: '/label-marker', component: () => import('./components/label_marker') },
    { path: '/heat-map', component: () => import('./components/heat_map') },
    { path: '/airline', component: () => import('./components/airline') },
    { path: '/cluster', component: () => import('./components/cluster') },
    { path: '/stratum_marker', component: () => import('./components/stratum_marker') },
    { path: '/info_window', component: () => import('./components/info_window') },
  ],
});

export default router;
