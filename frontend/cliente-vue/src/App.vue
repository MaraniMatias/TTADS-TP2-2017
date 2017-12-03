<template>
  <div class="app">
    <app-header></app-header>
    <div class="ui main container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import header from './components/header.vue';

export default {
  name: 'app',
  components: {
    'app-header': header,
  },

  data(){
    return{

    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
