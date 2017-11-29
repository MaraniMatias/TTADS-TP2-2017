<template>
  <div class="ui feed">
    <div class="event">
      <div class="label">
        <img src="/images/avatar/small/jenny.jpg">
      </div>
      <div class="content">
        <div class="date">
          3 days ago
        </div>
        <div class="summary">
           {{evento.nombre}}
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
