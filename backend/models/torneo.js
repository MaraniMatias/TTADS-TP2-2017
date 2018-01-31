var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('../models/partido');

//Creo el modelo y schema del torneo
var TorneoSchema = new Schema({
  nombre: {
    type: String
  },
  partidos:[{
    type : Schema.ObjectId,
    ref: 'partido'
  }],
  equipos: [{
    type : Schema.ObjectId,
    ref: 'equipos'
  }],
  fechaInicio:{
    type: Date
  },
  fechaFin:{
    type: Date
  }
});

var Torneo = mongoose.model('torneo',TorneoSchema);

module.exports = Torneo;
