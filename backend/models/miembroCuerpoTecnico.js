const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MiembroCuerpoTecnicoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del miembro tecnico es requerido']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido del miembro tecnico es requerido']
  },
  cargo: {
    type: String
  }
});

module.exports = mongoose.model('miembrosCuerpoTecnico', MiembroCuerpoTecnicoSchema);
