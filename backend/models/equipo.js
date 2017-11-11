var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquipoSchema = new Schema({
  nombre: {
    type: String,
    //Si no esta este campo en la consola aparece este error.
    required: [true, 'El nombre del equipo es requerido']
  },
  escudoURL: {
    type: String,
    default: 'http://www.fgf-gff.org/pub/skin/img/equipos/default.png'
  },
  jugadores:{
    type:[String]
  },
  goles: {
    type: Number
  },
  cuerpoTecnico:{
    type: [String]
  }
});

var Equipo = mongoose.model('equipo',EquipoSchema);

module.exports = Equipo;
