<template>
  <div>
    <div id="title">
      <h1>ABM TIPO EVENTOS</h1>
    </div>
    <table class="ui celled table">
    <thead>
      <tr>
        <th>Evento</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tipoEvento,index) in tiposEvento">
        <td>{{tipoEvento.nombre}}</td>
        <td>
          <button class="ui red basic button" @click="borrarTipoEvento(index)">Borrar</button>
          <button class="ui blue basic button"@click="editarTipoEvento(index)">Editar</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th colspan="3">
        <div class="ui left floated">
          <button class="ui green basic button" @click="agregarTipoEvento">Agregar</button>
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
    </tr>
  </tfoot>
  </table>
  <div class="form-alta" v-if="add">
    <h1 class="ui title"> Agregar Tipo Evento</h1>
    <form class="ui form">
      <div class="field">
        <label>Nombre</label>
        <input placeholder="Nombre" type="text" v-model="nombre" required>
      </div>
      <button class="ui button" type="submit" @click="guardarTipoEvento">Guardar</button>
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
    modoAlta: true,
    index: 0,
    nombre: '',
    add: false
  }
},

methods: {
  ...mapActions(['setTipoEvento','getTiposEvento','deleteTipoEvento','updateTipoEvento']),

  agregarTipoEvento: function(){
    this.add = !this.add
  },

  guardarTipoEvento: function(){
    if(this.modoAlta){
      this.setTipoEvento({
        nombre: this.nombre,
       })
    }else{
      this.updateTipoEvento({
        _id: this.tiposEvento[this.index]._id,
        nombre: this.nombre,
      });
      this.modoAlta = true;
    };
    this.add = !this.add;
  },

  borrarTipoEvento: function(index){
    this.deleteTipoEvento(this.tiposEvento[index])
  },

  editarTipoEvento: function(index){
    if(!this.add){
      this.agregarTipoEvento();
    }
    this.modoAlta = false;
    this.nombre = this.tiposEvento[index].nombre;
    this.index = index;
  }

},

computed: mapState(['tiposEvento']),

mounted: function () {
    this.getTiposEvento();
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
  width: 50%
}
</style>
