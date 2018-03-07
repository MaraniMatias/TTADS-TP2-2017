"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Torneo = require('../../models/torneo');
const Equipo = require('../../models/equipo');
const Partido = require('../../models/partido');
const Marcador = require('../../models/marcador');

// Fixture, usado en la pantalla principal paa listar los partidos
router.get('/fixture-activos',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    const filter = _.get(req, 'query.torneos', false) || false;
    var query = {
      fechaInicio: { "$gte": new Date() },
    };
    if (filter) {
      query.torneo = filter;
    }
    Partido.find(query)
      .select('torneo equipoA equipoB estado marcador fechaInicio categoria')
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
      .populate({
        path: 'torneo',
        select: 'nombre',
        model: Torneo
      })
      .skip(req.query.skip)
      .limit(req.query.limit)
      .sort('fechaInicio')
      .exec(function (err, partidos) {
        if (err) {
          // res, status, data, messager, error
          return sendRes(res, 500, [], "Ha ocurrido un error", err);
        } else {
          // res, status, data, messager, error
          return sendRes(res, 200, partidos || [], "Success", null);
        }
      });
  });

// Fixture, usado en la pantalla principal paa listar los partidos
router.get('/fixture-pasados',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    Partido.find({
        fechaInicio: { "$lt": new Date() }
      })
      .select('torneo equipoA equipoB estado marcador fechaInicio categoria')
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
      .populate({
        path: 'torneo',
        select: 'nombre',
        model: Torneo
      })
      .skip(req.query.skip)
      .limit(req.query.limit)
      .sort('fechaInicio')
      .exec(function (err, partidos) {
        if (err) {
          // res, status, data, messager, error
          return sendRes(res, 500, [], "Ha ocurrido un error", err);
        } else {
          // res, status, data, messager, error
          return sendRes(res, 200, partidos || [], "Success", null);
        }
      });
  });

// Recupera todos los torneos y partidos jugados con el equipo que tenga el ID
router.get('/torneos-por-equipo/:equipoId', function (req, res) {
  // Validar parámetro de la consulta
  const equipoId = _.get(req, 'params.equipoId', false) || false;
  Partido
    .find({
      $or: [
        { equipoA: equipoId },
        { equipoB: equipoId },
      ]
    })
    .select('torneo equipoA equipoB marcador fechaInicio categoria')
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
    .populate({
      path: 'torneo',
      select: 'nombre',
      model: Torneo
    })
    .exec(function (err, fixture) {
      if (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, [], "Ha ocurrido un error", err);
      } else {
        // res, status, data, messager, error
        return sendRes(res, 200, fixture || [], "Success", null);
      }
    });
});

module.exports = router;
