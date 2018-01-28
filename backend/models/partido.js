var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Evento = require('./tipoEvento');
var Equipo = require('./equipo');

//Creo el modelo y schema del partidos
var PartidoSchema = new Schema({
  /*equipos: {
    type: Array,
    required: true
  },*/
  equipos: [{
    type : Schema.ObjectId, ref: 'equipo'
  }],
  /*golesEquipo1: {
    type: Number
  },
  golesEquipo2: {
    type: Number
  },*/
  //El estado contendrá valores para 'Programado','En curso','Entretiempo','Terminado'
  estado: {
    type: String
  },
  /*eventos:{
    type: Array
  },*/
  eventos: [{
    type : Schema.ObjectId, ref: 'jugador'
  }],
  fechaInicio:{
    type: Date
  },
  msDescanso:{
    type: Number
  },
  estadio:{
    type: String
  },
  categoria:{
    type: String
  },
  arbitros:{
    type: [String]
  },
  destacado: {
    type: Boolean,
    default: false
  },
  marcador: {
    type : Schema.ObjectId, ref: 'marcador'
  }
});

var Partido = mongoose.model('partido',PartidoSchema);

module.exports = Partido;
