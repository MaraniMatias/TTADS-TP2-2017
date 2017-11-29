<template>
  <div>
    <h1>Próximos partidos</h1>
    <div class="ui cards">
      <card v-for="partido in partidos" :partido="partido"></card>
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

</style>
