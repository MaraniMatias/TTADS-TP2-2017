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
  eventos: [{
    eventoId: {
      type: Schema.ObjectId,
      ref: 'tipoEvento'
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
  },
  marcador: {
    type: Schema.Types.ObjectId,
    ref: 'marcador'
  }
});

module.exports = mongoose.model('partido', PartidoSchema);
