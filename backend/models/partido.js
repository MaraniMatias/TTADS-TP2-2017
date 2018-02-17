var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('../models/marcador');

//Creo el modelo y schema del partidos
var PartidoSchema = new Schema({
  equipos: [{
    type : Schema.ObjectId, ref: 'equipos'
  }],
  //El estado contendrá valores para 'Programado','En curso','Entretiempo','Terminado'
  estado: {
    type: String
  },
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
