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
        <tr v-for="(partido,index) in partidos">
          <th class="celda-equipos">
            <div class="escudo-tabla-container">
              <img class="escudo-tabla" :src="partido.equipos[0].escudoURL"/>
            </div>
            <div style="display: inline-block;">
              {{partido.equipos[0].nombre}}
            </div>
            <div style="display: inline-block; margin-left:5%; margin-right:5%">
              vs
            </div>
            <div style="display: inline-block;">
              {{partido.equipos[1].nombre}}
            </div>
            <div class="escudo-tabla-container">
              <img class="escudo-tabla" :src="partido.equipos[1].escudoURL"/>
            </div>
          </th>
          <th>{{formatDate(partido.fechaInicio)}} | {{formatTime(partido.fechaInicio)}}</th>
          <th>{{partido.estado}}</th>
          <th>
            <button class="ui red basic button" @click="borrarPartido(index)">Borrar</button>
            <button class="ui blue basic button"@click="editarPartido(index)">Editar</button>
          </th>
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
      <div class="fields">
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
      modoAlta: true,
      index: null,

      disabled: [],
      value: 'Fecha del partido',
      format: 'dd/MM/yyyy',
      clear: true,
      placeholder: 'Fecha del partido'

    }
  },
  methods:{
    ...mapActions(['getEquipos','getPartidos','setPartido','deletePartido','updatePartido']),

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

      if(this.modoAlta){
        var nuevoPartido = {
          "equipos": [this.equipo1,this.equipo2],
          "golesEquipo1": 0,
          "golesEquipo2": 0,
          "estado": 'Programado',
          "eventos": [],
          "fechaInicio": fecha,
          "fechaDescanso": null,
          "estadio": 'Estadio Monumental',
          "categoria": 'Adultos',
          "arbitros": [],
          "destacado": true
        };
        this.setPartido(nuevoPartido);
      }else{
          var partidoEdit = {
            "_id": this.partidos[this.index]._id,
            "equipos": [this.equipo1,this.equipo2],
            "golesEquipo1": 0,
            "golesEquipo2": 0,
            "estado": 'Programado',
            "eventos": [],
            "fechaInicio": fecha,
            "fechaDescanso": null,
            "estadio": 'Estadio Monumental',
            "categoria": 'Adultos',
            "arbitros": [],
            "destacado": true
          };
          this.updatePartido(partidoEdit);
        }
        this.add = !this.add;
      },

    editarPartido: function(index){
      if(!this.add){
        this.add=!this.add
      }
      this.modoAlta = false;

      //relleno el formulario
      this.equipo1 = this.partidos[index].equipos[0];
      this.equipo2 = this.partidos[index].equipos[1];

      this.index = index;
    },

    borrarPartido: function(index){
      this.deletePartido(this.partidos[index])
    },

    calcularMinutos(hora,minutos){
      var res = parseInt(hora)*60+parseInt(minutos);
      return res
    },

    addMinutes: function(date, minutes) {
      return new Date(date.getTime() + minutes*60000);
    },

    formatDate: function(fecha){
      console.log(fecha);
      return fecha.substring(0,10);
    },

    formatTime: function(fecha){
      return fecha.substring(11,16);
    }
  },

  computed: mapState(['equipos','partidos']),

  created() {
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

.celda-equipos{
  width: 30%;
}

.form-alta{
  border: 1px solid rgba(34,36,38,.1);
  padding: .92857143em .78571429em;
  background-color: #F9FAFB;
  width: 74%;
}

.escudo-tabla-container{
  width: 10%;
  height: 100%;
  display: inline-block;
}

.escudo-tabla{
  width: 100%;
  height: 100%;
}

</style>
