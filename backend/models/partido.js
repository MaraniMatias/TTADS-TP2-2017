var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creo el modelo y schema del partidos
var PartidoSchema = new Schema({
  primerEquipo: {
    type: String,
    required: true
  },
  segundoEquipo: {
    type: String,
    required: true
  },
  marcadorPrimerEquipo: {
    type: Number
  },
  marcadorSegundoEquipo: {
    type: Number
  },
  //El estado contendrá valores para 'Programado','En curso','Entretiempo','Terminado'
  estado: {
    type: String
  }
  eventos:{
    type: String[]
  }
  fechaYhoraInicio:{
    type: Date
  }
});

var Partido = mongoose.model('partido',PartidoSchema);

module.exports = Partido;
