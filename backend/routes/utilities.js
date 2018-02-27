const _ = require('lodash');

// Solo con el objetivo de enviar siempre una misma respuesta
module.exports.sendRes = function (res, cod, data, message, error) {
  res.status(cod);
  return res.json({ data, message, error });
};

// Normalizar parametros para el paginado
module.exports.queryPage = function (req, res, next) {
  // en caso de no estar definido se fuersa a 0
  const skip = _.get(req, 'query.skip', 0) || 0;
  // en caso de no estar definido se fuersa a 15
  let limit = _.get(req, 'query.limit', 15) || 15;
  limit = parseInt(limit, 10);
  req.query.skip = parseInt(skip, 10);
  req.query.limit = limit > 0 ? limit : 15;
  // Continuar con la consulta ala API
  next();
};
