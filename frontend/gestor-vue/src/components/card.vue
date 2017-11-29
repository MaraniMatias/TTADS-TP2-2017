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
          <div class="ui basic green button" @click="goPartidoInfo()">Ingresar</div>
          <div class="ui basic red button">Finalizar</div>
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
