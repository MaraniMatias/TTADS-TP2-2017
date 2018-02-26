const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creo el modelo y schema del partidos
const PartidoSchema = new Schema({
  equipoA: {
    type: Schema.Types.ObjectId,
    ref: 'Equipos'
  },
  equipoB: {
    type: Schema.Types.ObjectId,
    ref: 'Equipos'
  },
  estado: {
    type: String,
    enum: ['Programado','En curso','Entretiempo','Terminado'],
    default: 'Programado'
  },
  marcador: {
    type: Schema.Types.ObjectId,
    ref: 'Marcadores'
  },
  eventos: [{
    evento: {
      type: Schema.Types.ObjectId,
      ref: 'TiposEvento'
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

module.exports = mongoose.model('Partidos', PartidoSchema);
