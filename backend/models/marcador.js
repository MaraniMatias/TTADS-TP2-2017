const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarcadorSchema = new Schema({
  golesEquipoA: {
    type: Number,
    default: 0
  },
  golesEquipoB: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Marcadores', MarcadorSchema);
