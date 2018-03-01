<template>
  <div id="clock">
    <div class="ui message">

      <div class="content">
        <p v-if="!started">
          El encuentro aún no ha comenzado
        </p>
        <p v-if="started || paused" class="ui big label">{{time}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import VueTimers from 'vue-timers/mixin'
import { timer } from 'vue-timers'

export default{

  props:['started','paused','resumed','estadoPartido','fechaInicioPartido','msDescanso'],

  mixins: [VueTimers],

  data(){
    return{
      timeNuevo: 0,
      time: '',
    }
  },

  watch:{
    started: function(){
      if(!this.paused){
      this.comienzo(this.started);
    }
    },
    resumed: function(){
      if(this.resumed){
          this.$timers.start('updateTime');
      }
    },
    paused: function(){
      if(this.paused){
        console.log(this.timeNuevo);
        this.$emit('setMsDescanso',this.timeNuevo);
        this.$timers.stop('updateTime');
      }
    },
    estadoPartido: function(){
      if (this.estadoPartido === "Finalizado"){
        this.$timers.stop('updateTime');
      }
    }
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
      if(this.estadoPartido==="Iniciado"){
        this.$timers.start('updateTime');
      }
    },

    updateTime: function(){
      if(this.estadoPartido !== "Descanso"){
        this.timeNuevo += 1000
        this.msToHMS(this.timeNuevo);
      }
    },

    msToHMS: function( duration ) {
      console.log(duration);
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
    if(this.estadoPartido==="Iniciado" && this.resumed===false){
      var md = new Date(this.fechaInicioPartido);
      var today = new Date();
      var utc = today.getTime() + (today.getTimezoneOffset() * 60000);
      var nd = new Date(utc -21600000);
      this.timeNuevo = nd.getTime() - md.getTime();
      this.msToHMS(this.timeNuevo);
      this.crearTimer();
    }else if (this.estadoPartido==="Descanso" && this.resumed===false) {
      console.log('hola');
      this.timeNuevo = this.msDescanso;
      this.msToHMS(this.timeNuevo);
      this.crearTimer();
    }
  },
}
</script>

<style scoped>

</style>
