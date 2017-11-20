import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueRouter from 'vue-router'
import equipos from './components/equipos.vue'
import partidos from './components/partidos.vue'
import store from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  //mode: 'history', //navega sin recargar pag y sin #, requiere config. el backend
  routes: [
    {
      name: "equipos",
      path: '/equipos',
      component: equipos
    },
    {
      name: "partidos",
      path: '/partidos',
      component: partidos
    }
  ]
});

export default new Vue({
  el: '#app',
  router,
  store: new Vuex.Store(store),
  render: h => h(App)
})
