var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarcadorSchema = new Schema({
  equipos:[{
    type: Schema.ObjectId,
    ref: 'equipo'
  }],
  golesEquipoA:{
    type: Number,
    default: 0
  },
  golesEquipoB:{
    type: Number,
    default: 0
  }
});

var Marcador = mongoose.model('marcador', MarcadorSchema);

module.exports = Marcador;
