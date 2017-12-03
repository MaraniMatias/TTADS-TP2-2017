<template>
  <div id="clock">
    <div class="ui message">

      <div class="content">
        <p v-if="!started">
          El encuentro aún no ha comenzado
        </p>
        <p v-if="started" class="ui big label">{{time}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import VueTimers from 'vue-timers/mixin'
import { timer } from 'vue-timers'

export default{

  props:['started','paused','resumed','estadoPartido','fechaInicioPartido'],

  mixins: [VueTimers],

  data(){
    return{
      timeNuevo: 0,
      time: '',
    }
  },

  watch:{
    started: function(){
      this.comienzo(this.started);
    },
    resumed: function(){
      this.$timers.start('updateTime');
    },
    paused: function(){
      if(this.paused){
        this.$timers.stop('updateTime');
      }
    },
  },

  methods:{
    comienzo: function(estado){
      if (estado){
        this.crearTimer();
      }
    },

    crearTimer: function(){
      this.$timers.add({
        name: 'updateTime',
        timer: 1000,
        autostart: false
      });
      this.$timers.start('updateTime');
    },

    updateTime: function(){
      this.timeNuevo += 1000
      this.msToHMS(this.timeNuevo);
    },

    msToHMS: function( duration ) {
      var milliseconds = parseInt((duration%1000)/100)
              , seconds = parseInt((duration/1000)%60)
              , minutes = parseInt((duration/(1000*60))%60)
              , hours = parseInt((duration/(1000*60*60))%24);

          hours = (hours < 10) ? "0" + hours : hours;
          minutes = (minutes < 10) ? "0" + minutes : minutes;
          seconds = (seconds < 10) ? "0" + seconds : seconds;
          this.time = hours + ":" + minutes + ":" + seconds;
          this.$emit('timechanged',this.time);
    },
  },

  mounted(){
    if(this.started){
      var md = new Date(this.fechaInicioPartido);
      var today = new Date();
      var utc = today.getTime() + (today.getTimezoneOffset() * 60000);
      var nd = new Date(utc -21600000);
      this.timeNuevo = nd.getTime() - md.getTime();
      this.msToHMS(this.timeNuevo);
      this.crearTimer();
    }

  }
}
</script>

<style scoped>

</style>
