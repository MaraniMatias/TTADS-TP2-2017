var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Evento = require('./tipoEvento')

//Creo el modelo y schema del partidos
var PartidoSchema = new Schema({
  equipos: {
    type: [Object],
    required: true
  },
  golesEquipo1: {
    type: [Number]
  },
  golesEquipo2: {
    type: [Number]
  },
  //El estado contendrá valores para 'Programado','En curso','Entretiempo','Terminado'
  estado: {
    type: String
  },
  eventos:{
    type: [Object]
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
  },
  destacado: {
    type: Boolean
  }
});

var Partido = mongoose.model('partido',PartidoSchema);

module.exports = Partido;
