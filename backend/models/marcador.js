var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarcadorSchema = new Schema({
  equipoA:{
    id: Schema.ObjectId : ref: 'equipo',
    goles: Number
  },
  equipoB: {
    id: Schema.ObjectId : ref: 'equipo',
    goles: Number
  }
});

var Marcador = mongoose.model('marcador',MarcadorSchema);

module.exports = Marcador;
