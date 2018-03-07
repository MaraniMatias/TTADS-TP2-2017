const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creo el modelo y schema del torneo
const TorneoSchema = new Schema({
  nombre: {
    type: String
  },
  partidos: [{
    type: Schema.Types.ObjectId,
    ref: 'Partidos'
  }],
  fechaInicio: {
    type: Date
  },
  fechaFin: {
    type: Date
  }
});

const Torneo = mongoose.model('Torneos', TorneoSchema);

module.exports = Torneo;
