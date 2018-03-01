"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Partido = require('../../models/partido');
const Marcador = require('../../models/marcador');
const Equipo = require('../../models/equipo');
const TipoEvento = require('../../models/tipoEvento.js');

// Recupera todos los partidos
// http://localhost:3000/api/partido/?skip=1&limit=1&torneos=['nombreTorneo']
router.get('/partidos',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    const filter = _.get(req, 'query.torneos', [] ) || [];
    Partido.find({})
      .populate({
        path: 'equipoA',
        select: 'nombre escudoURL',
        model: Equipo
      })
      .populate({
        path: 'equipoB',
        select: 'nombre escudoURL',
        model: Equipo
      })
      .populate({
        path: 'marcador',
        model: Marcador
      })
      .sort('fechaInicio')
      .skip(req.query.skip)
      .limit(req.query.limit)
      .exec(function (err, partidos) {
        if (err || !partidos) {
          // res, status, data, messager, error
          return sendRes(res, 500, [], "Ha ocurrido un error", err);
        } else {
          // res, status, data, messager, error
          return sendRes(res, 200, partidos, "Success", null);
        }
      });
  });

// Recupera un partido
router.get('/partidos/:id', function (req, res) {
  // Validar parámetro de la consulta
  const id = _.get(req, 'params.id', false) || false;
  if (id) {
    Partido.findById(id)
      .populate({
        path: 'equipoA',
        select: 'nombre escudoURL',
        model: Equipo
      })
      .populate({
        path: 'equipoB',
        select: 'nombre escudoURL',
        model: Equipo
      })
      .populate({
        path: 'marcador',
        model: Marcador
      })
      // .populate('eventos') // api/eventos-por-partido/:idPartido
      .then(function (partido) {
        // res, status, data, messager, error
        return sendRes(res, 200, partido || [], "Success", null);
      })
      .catch(function (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, "Ha ocurrido un error", err);
      });
  } else {
    // res, status, data, messager, error
    return sendRes(res, 402, null, "Parametro id del evento es requerido", null);
  }
});

// Listado de eventos por partido
// buscar partido con el id
// filtrar solos los evento
// ordenar con fechaYhora
// usar paginado para obtener una lista controlablee
router.get('/eventos-por-partido/:idPartido',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetro de la consulta
    const id = _.get(req, 'params.idPartido', false) || false;
    if (id) {
      Partido.findById(id)
        .populate({
          path: 'eventos.evento',
          model: TipoEvento
        })
        .select('eventos')
        .skip(req.query.skip)
        .limit(req.query.limit)
        .then(function (partido) {
          // res, status, data, messager, error
          return sendRes(res, 200, partido.eventos, "Success", null);
        })
        .catch(function (err) {
          // res, status, data, messager, error
          return sendRes(res, 500, null, "Ha ocurrido un error", err);
        });
    } else {
      // res, status, data, messager, error
      return sendRes(res, 402, null, "Parametro ID del partido es requerido", null);
    }
  });


//Agrega un partido a la bd
router.post('/partidos', function (req, res, next) {
  Partido.create(req.body).then(function (partido) {
    res.status(200).send(partido);
  }).catch(next);
});

//Modifica un partido en la bd
router.put('/partidos/:id', function (req, res) {
  Partido.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
    Partido.findOne({ _id: req.params.id })
      .populate('equipos')
      .populate('eventos')
      .populate('marcador')
      .exec(function (err, partido) {
        if (err || !partido) {
          return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
        } else {
          return res.status(200).send(partido);
        }
      });
  });
});

//Borra un partido de la bd
router.delete('/partidos/:id', function (req, res) {
  Partido.findByIdAndRemove({ _id: req.params.id }).then(function (partido) {
    res.status(200).send(partido);
  });
});

module.exports = router;