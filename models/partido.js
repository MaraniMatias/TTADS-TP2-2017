const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creo el modelo y schema del partidos
const PartidoSchema = new Schema({
  // Es redundante pero ganamos rendimiento.
  torneo: {
    type: Schema.Types.ObjectId,
    ref: 'Torneos',
  },
  equipoA: {
    type: Schema.Types.ObjectId,
    ref: 'Equipos',
    required: [true, 'El ID del equipoA es requerido']
  },
  equipoB: {
    type: Schema.Types.ObjectId,
    ref: 'Equipos',
    required: [true, 'El ID del equipoB es requerido']
  },
  estado: {
    type: String,
    enum: ['Programado', 'En curso', 'Entretiempo', 'Terminado', 'Iniciado'],
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
    descripcion: String,
    fecha: {
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
  // TODO: no implementado
  destacado: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Partidos', PartidoSchema);
