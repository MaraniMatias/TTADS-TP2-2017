<template>
  <div class="ui feed">
    <div class="event">
      <div class="label">
        <img src="https://images.vexels.com/media/users/3/131904/isolated/preview/314ac7a195e5759f2cfadde070a92cc7-volver-a-cargar-el-icono-del-reloj-temporizador-by-vexels.png">
      </div>
      <div class="content">
        <div class="date">
          {{evento.fecha}}
        </div>
        <div class="summary">
           {{evento.tipoEvento.nombre}} -
           {{evento.team.nombre}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  props:['evento'],

  data(){
    return{

    }
  }

}
</script>

<style scoped>

</style>
