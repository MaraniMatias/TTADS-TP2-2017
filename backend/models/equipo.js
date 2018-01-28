var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Jugador = require('../models/jugador');

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
  jugadores:[{
    type : Schema.Types.ObjectId, ref: 'jugador'
  }],
  goles: {
    type: Number
  },
  cuerpoTecnico:[{
    type : Schema.ObjectId, ref: 'miembroCuerpoTecnico'
  }]
});

var Equipo = mongoose.model('equipo',EquipoSchema);

module.exports = Equipo;
