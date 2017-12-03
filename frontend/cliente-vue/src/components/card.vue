<template>
    <div class="card">
      <div class="content">
        <div class="header">
          {{partido.equipos[0].nombre}} vs {{partido.equipos[1].nombre}}
        </div>
        <div class="meta">
          {{partido.estadio}}
        </div>
        <div class="description">
          {{this.formatDate(partido.fechaInicio)}} | {{this.formatTime(partido.fechaInicio)}}
        </div>
      </div>
      <div class="extra content">
        <div class="ui two buttons">
          <div v-if="partido.estado !=='Finalizado'" class="ui basic green button" @click="goPartidoInfo()">Ingresar</div>
          <div v-if="partido.estado ==='Finalizado'" class="ui red label">Partido finalizado</div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default{

  props:['partido'],

  data() {
    return {
      fecha: '',
      hora: '',
      //partido: null
    }
  },

  methods:{
    goPartidoInfo: function(){
      this.$router.push({ name: 'partidoInfo', params: { partidoId: this.partido._id } });
    },
    formatDate: function(fecha){
      return fecha.substring(0,10);
    },
    formatTime: function(fecha){
      return fecha.substring(11,16);
    }
  },

  created(){
    //this.partido = this.$store.getters.findPartido(this.partidoId);
  }

}
</script>

<style scoped>

</style>
