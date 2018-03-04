const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = new Schema({
  nombre: {
    type: String,
    // Si no esta este campo en la consola aparece este error.
    required: [true, 'El nombre del equipo es requerido']
  },
  escudoURL: {
    type: String,
    default: 'http://www.fgf-gff.org/pub/skin/img/equipos/default.png'
  },
  jugadores: [{
    type: Schema.Types.ObjectId,
    ref: 'Jugadores'
  }],
  goles: {
    type: Number,
    default: 0
  },
  cuerpoTecnico: [{
    type: Schema.Types.ObjectId,
    ref: 'MiembrosCuerpoTecnico'
  }]
});

module.exports = mongoose.model('Equipos', EquipoSchema);
