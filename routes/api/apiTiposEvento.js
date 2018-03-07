"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const passport = require('passport');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const TipoEvento = require('../../models/tipoEvento');

router.get('/tipos-evento',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetro de la consulta
    const nombre = _.get(req, 'query.nombre', false) || false;
    let query = {}
    if (nombre) {
      query.nombre = { $regex: nombre, $options: 'i' };
    }
    TipoEvento
      .find(query)
      .select('nombre')
      .sort('nombre')
      .skip(req.query.skip)
      .limit(req.query.limit)
      .exec(function (err, tiposEvento) {
        if (err) {
          // res, status, data, messager, error
          return sendRes(res, 500, [], "Ha ocurrido un error", err);
        } else {
          // res, status, data, messager, error
          return sendRes(res, 200, tiposEvento || [], "Success", null);
        }
      });
  });

// Ger tipo de evento por ID
router.get('/tipos-evento/:id', function (req, res) {
  TipoEvento.findById(req.params.id)
    .then(function (tipoEvento) {
      // res, status, data, messager, error
      return sendRes(res, 200, tipoEvento || {}, "Success", null);
    })
    .catch(function (err) {
      // res, status, data, messager, error
      return sendRes(res, 500, null, "Ha ocurrido un error", err);
    });
});

// Agrega un tipo de evento a la bd
router.post('/tipos-evento',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const nombre = _.get(req, 'body.tipo-evento.nombre', false) || false;
    if (nombre) {
      const tipoEvento = new TipoEvento({
        nombre: nombre
      });
      tipoEvento.save((err, tipoevento_db) => {
        if (err || !tipoevento_db) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos crear el tipo de evento :(");
        } else {
          return sendRes(res, 200, tipoevento_db, "Success", null);
        }
      });
    } else {
      return sendRes(res, 402, null, "El parametro nombre es requerido", null);
    }
  });

// Modifica un tipo de evento en la bd
router.put('/tipos-evento/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const nombre = _.get(req, 'body.tipoevento.nombre', false) || false;
    if (nombre) {
      TipoEvento.findById(req.params.id)
        .exec(function (err, tipoEvento) {
          if (err || !tipoEvento) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el tipo de evento :(");
          } else {
            tipoEvento.nombre = nombre;
            tipoEvento.save(function (err, tipoevento_db) {
              if (err || !tipoevento_db) {
                return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el tipo de evento :(");
              } else {
                return sendRes(res, 200, tipoEvento, "Success", null);
              }
            })
          }
        });
    } else {
      return sendRes(res, 402, null, "Parameros requeridos: nombre", null);
    }
  });

//Borra un tipo de evento de la bd
router.delete('/tipos-evento/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    TipoEvento.deleteOne({ _id: req.params.id }, function (err, tipoevento_db) {
      if (err || !tipoevento_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el tipo de evento :(");
      } else {
        return sendRes(res, 200, tipoevento_db, "Success", null);
      }
    });
  });

module.exports = router;
