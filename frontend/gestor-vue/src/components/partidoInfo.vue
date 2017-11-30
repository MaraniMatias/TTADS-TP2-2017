<template>
  <div>
    <div class="ui container">
      <div class="ui basic green button" @click="comenzarPartido">Comenzar partido</div>
      <div class="ui basic red button" @click="finalizarPartido">Finalizar partido</div>
    </div>
    <div class="ui three column stackable grid">
      <div class="column" v-if="iniciado">
        <h2>Eventos equipo 1</h2>
        <button class="ui inverted blue button" v-for="(tipoEvento,index) in tiposEvento" @click="cargarEvento(index,1)">
          {{tipoEvento.nombre}}
        </button>
      </div>
      <div class="column" v-if="iniciado">
        <h2>Sucesos del partido</h2>
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

        <feed v-for="evento in partido.eventos" :evento="evento"></feed>
        <!-- div para feed de comienzo -->
        <div v-if="iniciado" class="ui feed">
          <div class="event">
            <div class="label">
              <img src="https://images.vexels.com/media/users/3/131904/isolated/preview/314ac7a195e5759f2cfadde070a92cc7-volver-a-cargar-el-icono-del-reloj-temporizador-by-vexels.png">
            </div>
            <div class="content">
              <div class="date">
                Ahora
              </div>
              <div class="summary">
                 Comienzo del partido
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="botonera2" class="column" v-if="iniciado">
        <h2>Eventos equipo 2</h2>
        <button class="ui inverted blue button" v-for="(tipoEvento,index) in tiposEvento" @click="cargarEvento(index,2)">
          {{tipoEvento.nombre}}
        </button>
      </div>
    </div>
  </div>


</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import feed from './feed.vue';

export default{


  components:{
    'feed': feed
  },

  data(){
    return{
      partidoId: this.$route.params.partidoId,
      partido: {},
      iniciado: false,
      finalizado: false
    }
  },

  computed: mapState(['tiposEvento']),

  methods:{
    ...mapGetters(['findPartido']),
    ...mapActions(['getTiposEvento','updatePartido','getPartido','updatePartido','getPartidos']),

    comenzarPartido:function(){
      this.iniciado = true;
      this.partido.estado = "Iniciado";
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
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
      this.partido.eventos.unshift({
        tipoEvento: evento,
        team: equipo,
        fecha: dateTime});
      this.updatePartido(this.partido);
    }
  },

  mounted(){
    this.getPartidos();
    this.getTiposEvento();
    this.partido = this.$store.getters.findPartido(this.partidoId);
  }
}

</script>

<style scoped>

.ui.container{
  margin: 20px;
  text-align: center;
}

.ui.inverted.blue.button{
  display: block;
}

#botonera2{
  float: right;
}

</style>
