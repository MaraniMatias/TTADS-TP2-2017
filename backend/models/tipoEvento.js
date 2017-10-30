var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TipoEventoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El tipo de evento es requerido']
  }
});

var TipoEvento = mongoose.model('tipoEvento',TipoEventoSchema);

module.exports = TipoEvento;
