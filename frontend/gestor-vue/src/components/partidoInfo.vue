<template>
  <div>
    <div class="ui center aligned container">
      <clock :started="iniciado" :paused="pausa" :resumed="reanudado" :estadoPartido="partido.estado" :fechaInicioPartido="partido.fechaInicio" :msDescanso="partido.msDescanso" v-on:timechanged="setReloj($event)" v-on:setMsDescanso="setMsDescanso($event)"></clock>
    </div>
    <div class="ui container">
      <div class="ui basic green button" @click="comenzarPartido">Comenzar partido</div>
      <div class="ui basic yellow button" @click="pausarPartido">{{textoDescanso}}</div>
      <div class="ui basic red button" @click="finalizarPartido">Finalizar partido</div>
    </div>
    <div v-if="iniciado || pausa" class="ui three column stackable grid">
      <div class="column">
        <h2>{{partido.equipos[0].nombre}}</h2>
        <h2>{{partido.golesEquipo1}}</h2>
        <button class="ui inverted blue button" v-for="(tipoEvento,index) in tiposEvento" @click="cargarEvento(index,1)">
          {{tipoEvento.nombre}}
        </button>
      </div>
      <div class="column">
        <h2 style="text-align:center">Sucesos del partido</h2>
        <!--div para feed de fin-->
        <div v-if="finalizado" class="ui feed">
          <div class="event">
            <div class="label">
              <img src="https://images.vexels.com/media/users/3/131904/isolated/preview/314ac7a195e5759f2cfadde070a92cc7-volver-a-cargar-el-icono-del-reloj-temporizador-by-vexels.png">
            </div>
            <div class="content">
              <div class="date">
                Ahora
              </div>
              <div class="summary">
                 Fin del partido
              </div>
            </div>
          </div>
        </div>
        <div class="sucesos">
          <feed v-for="evento in partido.eventos" :evento="evento"></feed>
        </div>
        <!-- div para feed de comienzo -->
        <div v-if="iniciado" class="ui feed sucesos">
          <div class="event">
            <div class="label">
              <img src="https://images.vexels.com/media/users/3/131904/isolated/preview/314ac7a195e5759f2cfadde070a92cc7-volver-a-cargar-el-icono-del-reloj-temporizador-by-vexels.png">
            </div>
            <div class="content">
              <div class="date">
                00:00:00
              </div>
              <div class="summary">
                 Comienzo del partido
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <h2 class="derecha">{{partido.equipos[1].nombre}}</h2>
        <h2 class="derecha">{{partido.golesEquipo2}}</h2>
        <button id="botonera2" class="ui inverted blue button" v-for="(tipoEvento,index) in tiposEvento" @click="cargarEvento(index,2)">
          {{tipoEvento.nombre}}
        </button>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import feed from './feed.vue';
import clock from './clock.vue';

export default{

  components:{
    'feed': feed,
    'clock': clock
  },

  data(){
    return{
      partidoId: this.$route.params.partidoId,
      partido: {},
      iniciado: false,
      finalizado: false,
      pausa: false,
      reanudado: false,
      dateTime: null,
      reloj:'',
      textoDescanso:'Descanso'
    }
  },

  computed: mapState(['tiposEvento']),

  methods:{
    ...mapGetters(['findPartido']),
    ...mapActions(['getTiposEvento','updatePartido','getPartido','updatePartido','getPartidos']),

    comenzarPartido:function(){
      if(!this.iniciado){
        var today = new Date();
        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        var utc = today.getTime() + (today.getTimezoneOffset() * 60000);
        // create new Date object for different city
        // using supplied offset
        var nd = new Date(utc -21600000);
        this.dateTime = nd;
        this.iniciado = true;
        this.partido.estado = "Iniciado";
        this.partido.fechaInicio = this.dateTime;
        this.updatePartido(this.partido);
      }

    },

    pausarPartido: function(){
      this.pausa = !this.pausa;
      if(this.pausa){

        var today = new Date();
        var utc = today.getTime() + (today.getTimezoneOffset() * 60000);
        var nd = new Date(utc -21600000);

        this.reanudado = false;
        this.textoDescanso ='Reanudar'
        this.partido.estado = "Descanso"
      }else{
        this.reanudado = true;
        this.textoDescanso ='Descanso'
        this.partido.estado = "Iniciado"
      }
      this.updatePartido(this.partido);
    },

    setMsDescanso:function(e){
      this.partido.msDescanso=e;
      this.updatePartido(this.partido);
    },

    finalizarPartido:function(){
      this.finalizado = true;
      this.partido.estado = "Finalizado";
      this.updatePartido(this.partido);
      this.$router.push({ name: 'home'});
    },

    cargarEvento: function(index,num){
      var equipo = null;
      if(num===1){
        equipo = this.partido.equipos[0];
      }else{
        equipo = this.partido.equipos[1];
      }
      var evento = this.tiposEvento[index];

      if(this.tiposEvento[index].nombre==="GOL" && num ===1){
        this.partido.golesEquipo1 += 1
      }else if (this.tiposEvento[index].nombre==="GOL" && num ===2) {
        this.partido.golesEquipo2 += 1
      }
      var dateTime = this.reloj
      this.partido.eventos.unshift({
        tipoEvento: evento,
        team: equipo,
        fecha: dateTime});
      this.updatePartido(this.partido);
    },

    setReloj: function(e){
      this.reloj = e
    }

  },

  created(){
    this.getPartidos();
    this.getTiposEvento();
    this.partido = this.$store.getters.findPartido(this.partidoId);
    if(this.partido.estado==="Iniciado"){
      this.iniciado=true;
    }else if (this.partido.estado==="Descanso") {
      this.iniciado=true;
      this.pausa=true;
      this.textoDescanso="Reanudar";
    }
  },

}

</script>

<style scoped>

.ui.container{
  margin: 20px;
  text-align: center;
}

.ui.inverted.blue.button{
  width: 200px;
}

#botonera2{
  display: block;
  position: relative;
  float: right;
}

.derecha{
  text-align: right;
}

.ui.center.aligned.container{
  width: 50%
}

.sucesos{
  margin-left: 10%;
}

</style>
