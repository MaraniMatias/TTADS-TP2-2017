const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creo el modelo y schema del partidos
const PartidoSchema = new Schema({
  equipos: [{
    type: Schema.ObjectId,
    ref: 'equipos'
  }],
  // El estado contendrá valores para 'Programado','En curso','Entretiempo','Terminado'
  estado: {
    type: String
  },
  marcador: {
    type: Schema.Types.ObjectId,
    ref: 'marcadores'
  },
  eventos: [{
    evento: {
      type: Schema.Types.ObjectId,
      ref: 'tiposEvento'
    },
    fechaYhora: {
      type: Date,
      default: new Date()
    }
  }],
  fechaInicio: {
    type: Date
  },
  msDescanso: {
    type: Number,
    default: 0
  },
  estadio: {
    type: String
  },
  categoria: {
    type: String
  },
  arbitros: {
    type: [String]
  },
  destacado: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('partidos', PartidoSchema);
