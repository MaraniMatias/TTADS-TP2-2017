<template>
  <div>
    <div id="title">
      <h1>ABM EQUIPOS</h1>
    </div>
    <table class="ui celled table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Escudo</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="equipo in teams">
        <td>{{equipo.nombre}}</td>
        <td class="fila-escudo">
          <img class="escudo" :src='equipo.escudoURL'/>
        <td>
          <button class="ui red basic button">Borrar</button>
          <button class="ui blue basic button">Editar</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr><th colspan="3">
        <div class="ui left floated">
          <button class="ui green basic button" @click="agregarEquipo">Agregar</button>
        </div>

        <!--<div class="ui right floated pagination menu">
          <a class="icon item">
            <i class="left chevron icon"></i>
          </a>
          <a class="item">1</a>
          <a class="item">2</a>
          <a class="item">3</a>
          <a class="item">4</a>
          <a class="icon item">
            <i class="right chevron icon"></i>
          </a>
        </div>-->
      </th>
    </tr></tfoot>
  </table>
  <div class="form-alta" v-if="add">
    <h1 class="ui title"> Agregar equipo</h1>
    <form class="ui form">
      <div class="field">
        <label>Nombre</label>
        <input placeholder="Nombre" type="text" v-model="nombre" required>
      </div>
      <div class="field">
        <label>URL Escudo</label>
        <input placeholder="URL" type="text" v-model="escudoURL" required>
      </div>
      <button class="ui button" type="submit" @click="guardarEquipo">Guardar</button>
    </form>
  </div>
</div>

</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import axios from 'axios';
export default {

data(){
  return{
    nombre: '',
    escudoURL: '',
    teams: [],
    add: false
  }
},

methods: {
  agregarEquipo: function(){
    this.add = !this.add
  },

  guardarEquipo: function(){
    this.$store.dispatch('setEquipo', {
      nombre: this.nombre,
      escudoURL: this.escudoURL
     })
  }
},

computed: {
  ...mapState(['equipos']),
  ...mapActions(['setEquipo'])
},


mounted: function () {
    this.$store.dispatch('getEquipos');
    this.teams = this.equipos
  }
}

</script>

<style scoped>
#title{
  margin: 0 auto;
}
.ui.left.floated{
  display: inline-block;
}
.fila-escudo{
  margin: 0 auto;
  text-align: center;
}
.escudo{
    height: 100%;
    width: 20%;
}
.form-alta{
  border: 1px solid rgba(34,36,38,.1);
  padding: .92857143em .78571429em;
  background-color: #F9FAFB;
  width: 50%
}

</style>
