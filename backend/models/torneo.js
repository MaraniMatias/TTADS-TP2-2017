const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creo el modelo y schema del torneo
const TorneoSchema = new Schema({
  nombre: {
    type: String
  },
  partidos: [{
    type: Schema.ObjectId,
    ref: 'partidos'
  }],
  fechaInicio: {
    type: Date
  },
  fechaFin: {
    type: Date
  }
});

const Torneo = mongoose.model('torneos', TorneoSchema);

module.exports = Torneo;
