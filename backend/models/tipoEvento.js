const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoEventoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El tipo de evento es requerido']
  },
  fechaYhora: {
    type: Date
  }
});

module.exports =  mongoose.model('tipoEvento', TipoEventoSchema);
