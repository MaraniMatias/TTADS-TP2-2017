import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueRouter from 'vue-router'
import home from './components/home.vue'
import equipos from './components/equipos.vue'
import partidos from './components/partidos.vue'
import partidoInfo from './components/partidoInfo.vue'
import tiposEvento from './components/tiposEvento.vue'

import store from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  //mode: 'history', //navega sin recargar pag y sin #, requiere config. el backend
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      name: "home",
      path: '/home',
      component: home
    },
    {
      name: "equipos",
      path: '/equipos',
      component: equipos
    },
    {
      name: "partidos",
      path: '/partidos',
      component: partidos
    },
    {
      name: "tiposEvento",
      path: '/tiposEvento',
      component: tiposEvento
    },
    {
      name: "partidoInfo",
      path: '/partidoInfo',
      component: partidoInfo
    },
  ]
});

//router.replace('/home');

export default new Vue({
  el: '#app',
  router,
  store: new Vuex.Store(store),
  render: h => h(App)
})
