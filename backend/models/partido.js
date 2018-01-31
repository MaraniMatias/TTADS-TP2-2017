var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('../models/marcador');

//Creo el modelo y schema del partidos
var PartidoSchema = new Schema({
  /*equipos: {
    type: Array,
    required: true
  },*/
  equipos: [{
    type : Schema.ObjectId, ref: 'equipos'
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
    type : Schema.Types.ObjectId,
    ref: 'marcador'
  }
});

var Partido = mongoose.model('partido',PartidoSchema);

module.exports = Partido;
