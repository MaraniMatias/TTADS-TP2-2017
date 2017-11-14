import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import equipos from './components/equipos.vue'
import partidos from './components/partidos.vue'

Vue.use(VueRouter);

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
  render: h => h(App)
})
