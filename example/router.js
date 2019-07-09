import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  base: '/map_point',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/map-point',
    },
    { path: '/map-point', component: () => import('./components/map_point') },
  ],
});

export default router;
