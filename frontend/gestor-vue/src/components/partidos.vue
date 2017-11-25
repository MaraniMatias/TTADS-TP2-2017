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
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="3">
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
            {{equipo1}}
            <i class="dropdown icon"></i>
            <div class="menu">
              <div class="item" v-for="(equipo,index) in equipos" @click="equipo1 = equipo.nombre">
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
            {{equipo2}}
            <i class="dropdown icon"></i>
            <div class="menu">
              <div class="item" v-for="(equipo,index) in equipos" @click="equipo2 = equipo.nombre">
                <img :src="equipo.escudoURL" />
                {{equipo.nombre}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <label>Fecha del partido</label>
        <calendar :value="value" :disabled-days-of-week="disabled" :format="format" :clear-button="clear" :placeholder="placeholder" ></calendar>
      </div>
      <div class="field">
        <label>Hora del partido</label>
        <time-picker></time-picker>
      </div>
      <button class="ui button" type="submit">Guardar</button>
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
      equipo1:'Elija equipo 1',
      equipo2:'Elija equipo 2',
      disabled: [],
      value: 'Fecha del partido',
      format: 'yyyy-MM-dd',
      clear: true,
      placeholder: 'Fecha del partido',
      add: false
    }
  },
  methods:{
    ...mapActions(['getEquipos']),

    agregarPartido: function(){
      this.add = !this.add;
    }
  },
  computed: mapState(['equipos']),

  mounted: function () {
      this.getEquipos();
  }
}
</script>

<style scoped>

.time-picker input.display-time{
  height: 38px;
}

.form-alta{
  border: 1px solid rgba(34,36,38,.1);
  padding: .92857143em .78571429em;
  background-color: #F9FAFB;
  width: 40%
}

</style>
