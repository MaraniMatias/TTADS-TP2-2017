<template>
  <div >
    <div  id="title">
      <h1>ABM PARTIDOS</h1>
    </div>
    <!-- Tabla de partidos -->
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Equipos</th>
          <th>Fecha y hora</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="partido in partidos">
          <th>{{partido.equipos[0].nombre}} vs {{partido.equipos[1].nombre}}</th>
          <th>{{partido.fechaInicio}}</th>
          <th>{{partido.estado}}</th>
          <th>fdf</th>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="4">
          <div class="ui left floated">
            <button class="ui green basic button" @click="agregarPartido">Agregar</button>
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

    <!--Formulario -->
    <form v-if="add" class="ui form form-alta">
      <h1 class="ui title"> Agregar partido</h1>
      <div class="field">
        <label>Equipo 1</label>
        <div class="ui compact menu">
          <div class="ui simple dropdown item">
            <div class="el">
              <div v-if="equipo1 === null">
                Elegir equipo
              </div>
              <div v-else-if="equipo1 !== null">
                {{equipo1.nombre}}
              </div>
            </div>
            <i class="dropdown icon"></i>
            <div class="menu">
              <div class="item" v-for="(equipo,index) in equipos" @click="equipo1 = equipo">
                <img :src="equipo.escudoURL" />
                {{equipo.nombre}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <label>Equipo 2</label>
        <div class="ui compact menu">
          <div class="ui simple dropdown item">
            <div class="el">
              <div v-if="equipo2 === null">
                Elegir equipo
              </div>
              <div v-else-if="equipo2 !== null">
                {{equipo2.nombre}}
              </div>
            </div>
            <i class="dropdown icon"></i>
            <div class="menu">
              <div class="item" v-for="(equipo,index) in equipos" @click="equipo2 = equipo">
                <img :src="equipo.escudoURL" />
                {{equipo.nombre}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <label>Fecha del partido</label>
        <calendar :value="value" :disabled-days-of-week="disabled" :format="format" :clear-button="clear" :placeholder="placeholder" v-on:fechaintro="setFecha($event)"></calendar>
      </div>
      <div class="field">
        <label>Hora del partido</label>
        <time-picker v-on:inputVal  ="setHora($event)"></time-picker>
      </div>
      <button class="ui button" type="submit" @click="guardarPartido">Guardar</button>
    </form>

</div>
</template>

<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import calendar from './calendar.vue';
import timePicker from './timePicker.vue';

export default {
  components:{
    'calendar': calendar,
    'time-picker': timePicker
  },
  data(){
    return{
      add: false,
      equipo1:null,
      equipo2:null,
      fecha:null,
      hora:null,

      disabled: [],
      value: 'Fecha del partido',
      format: 'dd/MM/yyyy',
      clear: true,
      placeholder: 'Fecha del partido'

    }
  },
  methods:{
    ...mapActions(['getEquipos','getPartidos','setPartido']),

    setFecha(e){
      this.fecha = new Date(e.getFullYear(), e.getMonth(),e.getDate(), -3, 0, 0);
    },

    setHora(e){
      this.hora = e;
    },

    agregarPartido: function(){
      this.add = !this.add;
    },

    guardarPartido: function(){

      var fecha = this.addMinutes(this.fecha,this.calcularMinutos(this.hora.hora,this.hora.minutos));

      var nuevoPartido = {
        "equipos": [this.equipo1,this.equipo2],
        "golesEquipo1": 0,
        "golesEquipo2": 0,
        "estado": 'Programado',
        "eventos": [],
        "fechaInicio": fecha,
        "estadio": 'Estadio Monumental',
        "categoria": 'Adultos',
        "arbitros": [],
        "destacado": true
      };
      this.setPartido(nuevoPartido);
    },

    calcularMinutos(hora,minutos){
      var res = parseInt(hora)*60+parseInt(minutos);
      return res
    },

    addMinutes: function(date, minutes) {
      return new Date(date.getTime() + minutes*60000);
    }
  },

  computed: mapState(['equipos','partidos']),

  mounted: function () {
      this.getEquipos();
      this.getPartidos();
  }
}
</script>

<style scoped>

.time-picker input.display-time{
  height: 38px;
}

.ui.simple.dropdown.item{
  width: 200px;
}

.el{
  width: 90%
}

.form-alta{
  border: 1px solid rgba(34,36,38,.1);
  padding: .92857143em .78571429em;
  background-color: #F9FAFB;
  width: 40%
}

</style>
