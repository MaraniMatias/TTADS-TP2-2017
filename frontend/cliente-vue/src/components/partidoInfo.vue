<template>
  <div>
    <div class="ui center aligned container">
      <clock :started="iniciado" :paused="pausa" :resumed="reanudado" :estadoPartido="partido.estado" :fechaInicioPartido="partido.fechaInicio" :msDescanso="partido.msDescanso" v-on:timechanged="setReloj($event)" v-on:setMsDescanso="setMsDescanso($event)"></clock>
    </div>
    <div v-if="iniciado || pausa" class="ui three column stackable grid">
      <div class="column">
        <h2>{{partido.equipos[0].nombre}}</h2>
        <h2>{{partido.golesEquipo1}}</h2>
      </div>
      <div class="column">
        <h2 style="text-align:center">Sucesos del partido</h2>
        <!--div para feed de fin-->
        <div v-if="finalizado" class="ui feed sucesos">
          <div class="event">
            <div class="label">
              <img src="https://images.vexels.com/media/users/3/131904/isolated/preview/314ac7a195e5759f2cfadde070a92cc7-volver-a-cargar-el-icono-del-reloj-temporizador-by-vexels.png">
            </div>
            <div class="content">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import VueTimers from 'vue-timers/mixin'
import feed from './feed.vue';
import clock from './clock.vue';

export default{

  mixins: [VueTimers],

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

    setReloj: function(e){
      this.reloj = e
    },

    hola: function(){
      this.getPartidos();
      this.partido = this.$store.getters.findPartido(this.partidoId);
      if(this.partido.estado==="Iniciado"){
        this.iniciado=true;
      }else if (this.partido.estado==="Descanso") {
        this.reanudado = false;
        this.iniciado=true;
        this.pausa=true;
        this.textoDescanso="Reanudar";
      }else if (this.partido.estado==="Finalizado") {
        this.finalizado = true;
        this.$timers.stop('hola');
      }

      if(this.partido.estado==="Iniciado" && this.partido.msDescanso !== undefined){
        this.reanudado = true;
      }
    }
  },

  created(){
    this.hola();
    this.$timers.add({
      name: 'hola',
      timer: 5000,
      autostart: false
    });
    this.$timers.start('hola');
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
