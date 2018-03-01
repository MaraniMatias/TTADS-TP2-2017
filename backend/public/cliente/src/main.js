// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App'
import home from './components/home.vue'
import partidoInfo from './components/partidoInfo.vue'
import store from './store'

Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      name: 'home',
      path: '/home',
      component: home
    },
    {
      name: 'partidoInfo',
      path: '/partidoInfo',
      component: partidoInfo
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: new Vuex.Store(store),
  render: h => h(App)
})
