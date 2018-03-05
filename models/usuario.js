const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JugadorSchema = new Schema({
  nombre: {
    type: String,
    // Si no esta este campo en la consola aparece este error.
    required: [true, 'El nombre del usuario es requerido']
  },
  apellido: {
    type: String,
    // Si no esta este campo en la consola aparece este error.
    required: [true, 'El apellido del usuario es requerido']
  },
  username: {
    type: String,
    // Si no esta este campo en la consola aparece este error.
    required: [true, 'El campo user es requerido']
  },
  password: {
    type: String,
    // Si no esta este campo en la consola aparece este error.
    required: [true, 'El campo password es requerido']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  }
});

// TODO: pre save, encriptar pasword

module.exports = mongoose.model('Ususarios', JugadorSchema);
