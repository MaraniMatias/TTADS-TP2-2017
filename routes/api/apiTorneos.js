const express = require('express');
const router = express.Router();
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Torneo = require('../../models/torneo');

// Recupera todos los torneos
router.get('/torneos', function (req, res) {
  queryPage, // interceptor para completar el paginado
  Torneo.find({})
    .select('nombre fechaInicio fechaFin')
    .exec(function (err, equipos) {
      if (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, [], "Ha ocurrido un error", err);
      } else {
        // res, status, data, messager, error
        return sendRes(res, 200, equipos || [], "Success", null);
      }
    });
});

router.get('/torneos/:id', function (req, res) {
  Toreno.findById(req.params.id)
    // .populate('partidos') // Creo que no lo usamos
    .then(function (torneo) {
      // res, status, data, messager, error
      return sendRes(res, 200, torneo || {}, "Success", null);
    })
    .catch(function (err) {
      // res, status, data, messager, error
      return sendRes(res, 500, null, "Ha ocurrido un error", err);
    });
});

// Agrega un torneo a la bd
router.post('/torneos',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    const nombre = _.get(req, 'req.body.nombre', false) || false;
    const fechaInicio = _.get(req, 'req.body.fechaInicio', false) || false;
    const fechaFin = _.get(req, 'req.body.fechaFin', false) || false;

    if (nombre && fechaInicio && fechaFin) {
      const torneo = new Torneo({
        nombre: nombre,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
      });
      torneo.save((error, torneo_db) => {
        if (error || !torneo_db) {
          // res, status, data, messager, error
          return sendRes(res, 500, null, 'Error', error || "No pudimos crear el torneo :(");
        } else {
          // res, status, data, messager, error
          return sendRes(res, 200, torneo_db, "Success", null);
        }
      });
    } else {
      // res, status, data, messager, error
      return sendRes(res, 402, null, "Parameros requeridos: nombre, fechaInicio, fechaFin", null);
    }
  });

// Modifica un torneo en la bd
router.put('/torneos/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const nombre = _.get(req, 'req.body.nombre', false) || false;
    const fechaInicio = _.get(req, 'req.body.fechaInicio', false) || false;
    const fechaFin = _.get(req, 'req.body.fechaFin', false) || false;

    if (nombre && fechaInicio && fechaFin) {
      Torneo
        .findById(req.params.id)
        .exec(function (err, torneo) {
          if (err || !torneo) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el torneo :(");
          } else {
            torneo.nombre = nombre;
            turno.fechaInicio = fechaInicio;
            turno.fechaFin = fechaFin;

            torneo.seve(function (err, torneo_db) {
              if (err || !torneo_db) {
                return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el torneo :(");
              } else {
                return sendRes(res, 200, torneo, "Success", null);
              }
            });
          }
        });
    } else {
      // res, status, data, messager, error
      return sendRes(res, 402, null, "Parameros requeridos: nombre, fechaInicio, fechaFin", null);
    }
  });

// Borra un torneo de la bd
router.delete('/torneos/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    Torneo.deleteOne({ _id: req.params.id }, function (err, torneo_db) {
      if (err || !torneo_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el torneo :(");
      } else {
        return sendRes(res, 200, torneo_db, "Success", null);
      }
    });
  });

module.exports = router;
