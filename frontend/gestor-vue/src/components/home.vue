<template>
  <div>
    <h1>Próximos partidos</h1>
    <div class="card-container" v-for="partido in partidos" v-if="partido.estado!=='Finalizado'">
      <div class="ui cards">
        <card :partido="partido"></card>
      </div>
    </div>
    <h1>Partidos finalizados</h1>
    <div class="card-container" v-for="partido in partidos" v-if="partido.estado==='Finalizado'">
      <div class="ui cards">
        <card :partido="partido"></card>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

import card from './card.vue';

export default{

  components:{
    'card': card
  },

  data(){
    return{

    }
  },

  methods:{
    ...mapActions(['getPartidos'])
  },

  computed:mapState(['partidos']),

  mounted(){
    this.getPartidos();
  }
}

</script>

<style scoped>

.card-container{
  display: inline-block;
  margin-right: 0.5em;

}
.ui.cards{
  display: inline-block;
}

</style>
