<template>
  <div class="ui two column stackable grid">
    <div id="botonera" class="column">
      <h2>Eventos</h2>
      <button class="ui inverted blue button" v-for="(tipoEvento,index) in tiposEvento" @click="cargarEvento(index)">
        {{tipoEvento.nombre}}
      </button>
    </div>
    <div id="feed" class="column">
      <h2>Sucesos del partido</h2>
      <feed v-for="evento in partido.eventos" :evento="evento"></feed>
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
      partido: {}
    }
  },

  computed: mapState(['tiposEvento']),

  methods:{
    ...mapGetters(['findPartido']),
    ...mapActions(['getTiposEvento','updatePartido','getPartido','updatePartido','getPartidos']),

    cargarEvento: function(index){
      this.partido.eventos.unshift(this.tiposEvento[index]);
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
#botonera{
  width: 20%;
}

.ui.inverted.blue.button{
  display: block;
}

#feed{
  width: 80%
}
</style>
