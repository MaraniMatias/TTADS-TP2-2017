const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

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

JugadorSchema.pre("save", function (next) {
  if (this.isModified('password')) {
    this.password = crypto.createHash('sha256')
    .update(this.password)
    .digest("hex");
  }
  if (this.isModified('username')) {
    this.username = this.username.toLowerCase();
  }
  next();
});

// Checks password match
JugadorSchema.method('authenticate', function(password) {
    return crypto.createHash('sha256').update(password).digest("hex") === this.password;
});

module.exports = mongoose.model('Usuarios', JugadorSchema);
