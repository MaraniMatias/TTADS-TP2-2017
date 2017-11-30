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
          {{partido.fechaInicio}}
        </div>
      </div>
      <div class="extra content">
        <div class="ui two buttons">
          <div v-if="partido.estado !=='Finalizado'" class="ui basic green button" @click="goPartidoInfo()">Ingresar</div>
          <div v-if="partido.estado ==='Finalizado'" class="ui red label">Patido finalizado</div>
        </div>
      </div>
    </div>
</template>

<script>
export default{

  props:['partido'],

  data() {
    return {}
  },

  methods:{
    goPartidoInfo: function(){
      this.$router.push({ name: 'partidoInfo', params: { partidoId: this.partido._id } });
    }
  }
}
</script>

<style scoped>

</style>
