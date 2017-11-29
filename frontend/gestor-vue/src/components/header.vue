<template>
  <div class="ui menu">
    <router-link class="item" to="/home">
      <img src="../assets/handball-logo.png">
    </router-link>
    <div class="right menu">
      <router-link class="item" to="/partidos">ABM Partidos</router-link>
      <router-link class="item" to="/equipos">ABM Equipos</router-link>
      <router-link class="item" to="/tiposEvento">ABM Tipo Evento</router-link>
      <a class="item">Iniciar sesión</a>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.ui.menu {
  border-radius: 0px;
}

.ui.inverted.menu .router-link-active {
  background-color: #00b5ad;
  border-radius: 0px;
}
</style>
