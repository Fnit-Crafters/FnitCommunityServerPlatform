import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import TermsView from '@/views/Terms.vue';
import Application from '@/views/Application.vue';
import AgreeTerms from '@/views/AgreeTerms.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: AgreeTerms,
    },
    {
      path: '/application',
      name: 'application',
      component: Application,
    },
    {
      path: '/connect_discord',
      name: 'connect_discord',
    },
  ],
});
