var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creo el modelo y schema del partidos
var PartidoSchema = new Schema({
  /*primerEquipo: {
    type: String,
    required: [true, 'El campo de primer equipo es necesario']
  },
  segundoEquipo: {
    type: String,
    required: [true, 'El campo de segundo equipo es necesario']
  },*/
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
})
