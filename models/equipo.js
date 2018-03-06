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
    default: 'https://api.adorable.io/avatars/128/default.png'
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

EquipoSchema.pre("save", function (next) {
  if (typeof this.escudoURL === 'undefined' || this.escudoURL) {
    this.escudoURL = `https://api.adorable.io/avatars/128/${Math.floor(Math.random() * Math.floor(100))}.png`
  }
  next();
});

module.exports = mongoose.model('Equipos', EquipoSchema);
