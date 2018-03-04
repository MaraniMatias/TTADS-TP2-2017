<template>
  <div>
    <div id="title">
      <h1>ABM TORNEOS</h1>
    </div>
    <table class="ui celled table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Fecha Inicio</th>
        <th>Fecha Fin</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(torneo,index) in torneos">
        <td>{{torneo.nombre}}</td>
        <td>{{torneo.fechaInicio}}</td>
        <td>{{torneo.fechaFin}}</td>
        <td>
          <button class="ui red basic button" @click="borrarEquipo(index)">Borrar</button>
          <button class="ui blue basic button"@click="editarEquipo(index)">Editar</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th colspan="4">
        <div class="ui left floated">
          <button class="ui green basic button" @click="agregarEquipo">Agregar</button>
        </div>
      </th>
    </tr>
  </tfoot>
  </table>

  <div class="form-alta" v-if="add">
    <h1 class="ui title"> Agregar torneo</h1>
    <form class="ui form">
      <div class="fields">
        <div class="field">
          <label>Nombre</label>
          <input placeholder="Nombre" type="text" v-model="nombre" required>
        </div>
        <div class="field">
          <label>Fecha Inicio</label>
          <calendar :value="value" :disabled-days-of-week="disabled" :format="format" :clear-button="clear" :placeholder="placeholder" v-on:fechaintro="setFecha($event)"></calendar>
        </div>
        <div class="field">
          <label>Fecha Fin</label>
          <calendar :value="value" :disabled-days-of-week="disabled" :format="format" :clear-button="clear" :placeholder="placeholder" v-on:fechaintro="setFecha($event)"></calendar>
        </div>
      </div>
      <button class="ui button" type="submit" @click="guardarEquipo">Guardar</button>
    </form>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import axios from 'axios';
import calendar from './calendar.vue';

export default {
  components:{
    'calendar': calendar,
  },
data(){
  return{
    modoAlta: true,
    index: 0,
    nombre: '',
    escudoURL: '',
    add: false,

    disabled: [],
    value: '',
    format: 'dd/MM/yyyy',
    clear: true,
    placeholder: 'Ingrese la fecha'
  }
},

methods: {
  ...mapActions(['setEquipo','getTorneos','deleteEquipo','updateEquipo']),

  agregarEquipo: function(){
    this.add = !this.add
  },

  guardarEquipo: function(){
    if(this.modoAlta){
      this.setEquipo({
        nombre: this.nombre,
        escudoURL: this.escudoURL
       })
    }else{
      this.updateEquipo({
        id: this.equipos[this.index]._id,
        nombre: this.nombre,
        escudoURL: this.escudoURL
      });
      this.modoAlta = true;
    };
    this.add = !this.add;
  },

  borrarEquipo: function(index){
    this.deleteEquipo(this.equipos[index])
  },

  editarEquipo: function(index){
    if(!this.add){
      this.agregarEquipo();
    }
    this.modoAlta = false;
    this.nombre = this.equipos[index].nombre;
    this.escudoURL = this.equipos[index].escudoURL;
    this.index = index;
  }

},

computed: mapState(['torneos']),

mounted: function () {
    this.getTorneos();
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
    height: 50px;
    width: 50px;
}
.form-alta{
  border: 1px solid rgba(34,36,38,.1);
  padding: .92857143em .78571429em;
  background-color: #F9FAFB;
  width: 60%
}
</style>
