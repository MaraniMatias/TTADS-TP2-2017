const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JugadorSchema = new Schema({
  nombre: {
    type: String,
    // Si no esta este campo en la consola aparece este error.
    required: [true, 'El nombre del jugador es requerido']
  },
  apellido: {
    type: String,
    // Si no esta este campo en la consola aparece este error.
    required: [true, 'El apellido del jugador es requerido']
  },
  peso: {
    type: Number
  },
  altura: {
    type: Number
  },
  edad: {
    type: Number
  },
  cantGoles: {
    type: Number
  },
  cantAmarillas: {
    type: Number
  },
  cant2min: {
    type: Number
  },
  cantRojas: {
    type: Number
  }
});

module.exports = mongoose.model('jugadores', JugadorSchema);
