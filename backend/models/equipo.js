var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquipoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del equipo es requerido']
  }
  escudoURL: {
    type: String
    default: 'http://www.fgf-gff.org/pub/skin/img/equipos/default.png'
  }
});

var Equipo = mongoose.model('equipo',EquipoSchema);

module.exports = Equipo;
