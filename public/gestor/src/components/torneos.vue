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
        <td>{{formatDate(torneo.fechaInicio)}}</td>
        <td>{{formatDate(torneo.fechaFin)}}</td>
        <td>
          <button class="ui red basic button" @click="borrarTorneo(index)">Borrar</button>
          <button class="ui blue basic button"@click="editarTorneo(index)">Editar</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th colspan="4">
        <div class="ui left floated">
          <button class="ui green basic button" @click="agregarTorneo">Agregar</button>
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
          <calendar :value="valueFechaInicio" :disabled-days-of-week="disabled" :format="format" :clear-button="clear" :placeholder="placeholder" v-on:fechaintro="setFecha($event,1)"></calendar>
        </div>
        <div class="field">
          <label>Fecha Fin</label>
          <calendar :value="valueFechaFin" :disabled-days-of-week="disabled" :format="format" :clear-button="clear" :placeholder="placeholder" v-on:fechaintro="setFecha($event,2)"></calendar>
        </div>
      </div>
      <button class="ui button" type="submit" @click="guardarTorneo">Guardar</button>
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
    fechaInicio: '',
    fechaFin: '',
    add: false,

    disabled: [],
    valueFechaInicio: '',
    valueFechaFin: '',
    format: 'yyyy-MM-dd',
    clear: true,
    placeholder: 'Ingrese la fecha'
  }
},

methods: {
  ...mapActions(['setTorneo','getTorneos','deleteTorneo','updateTorneo']),

  agregarTorneo: function(){
    this.add = !this.add
  },

  guardarTorneo: function(){
    if(this.modoAlta){
      this.setTorneo({
        nombre: this.nombre,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
       })
    }else{
      this.updateTorneo({
        _id: this.torneos[this.index]._id,
        nombre: this.nombre,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
      });
      this.modoAlta = true;
    };
    this.add = !this.add;
  },

  borrarTorneo: function(index){
    this.deleteTorneo(this.torneos[index])
  },

  editarTorneo: function(index){
    if(!this.add){
      this.agregarTorneo();
    }
    this.modoAlta = false;
    this.nombre = this.torneos[index].nombre;
    this.fechaInicio = this.torneos[index].fechaInicio;
    this.fechaFin = this.torneos[index].fechaFin;
    this.valueFechaInicio = this.formatDate(this.fechaInicio);
    this.valueFechaFin = this.formatDate(this.fechaFin);
    this.index = index;
  },

  formatDate: function(fecha){
    return fecha.substring(0,10);
  },

  setFecha(e,type){
    if(type === 1){
      this.fechaInicio = new Date(e.getFullYear(), e.getMonth(),e.getDate(), -3, 0, 0);
    }else{
      this.fechaFin = new Date(e.getFullYear(), e.getMonth(),e.getDate(), -3, 0, 0);
    }
  },

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
