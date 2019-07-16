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
    { path: '/regions', component: () => import('./components/regions') },
  ],
});

export default router;
