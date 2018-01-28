var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MiembroCuerpoTecnicoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del miembro tecnico es requerido']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido del miembro tecnico es requerido']
  },
  cargo:{
    type: String
  }
});

var MiembroCuerpoTecnico = mongoose.model('miembroCuerpoTecnico',MiembroCuerpoTecnicoSchema);

module.exports = MiembroCuerpoTecnico;
