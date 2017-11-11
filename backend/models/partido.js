var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Evento = require('./tipoEvento')

//Creo el modelo y schema del partidos
var PartidoSchema = new Schema({
  equipos: {
    type: [String],
    required: true
  },
  marcadorFInal: {
    type: [Number]
  },
  //El estado contendrá valores para 'Programado','En curso','Entretiempo','Terminado'
  estado: {
    type: String
  },
  eventos:{
    type: [Evento]
  },
  fechaYhoraInicio:{
    type: Date
  },
  estadio:{
    type: String
  },
  categoria:{
    type: String
  },
  arbitros:{
    type: [String]
  }
});

var Partido = mongoose.model('partido',PartidoSchema);

module.exports = Partido;
