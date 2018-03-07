"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;
const passport = require('passport');

const Partido = require('../../models/partido');
const Marcador = require('../../models/marcador');
const Equipo = require('../../models/equipo');
const TipoEvento = require('../../models/tipoEvento.js');

// Recupera todos los partidos
// http://localhost:3000/api/partido/?skip=1&limit=1&find=any
router.get('/partidos',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    let query = {}
    const find = _.get(req, 'query.find', false) || false;
    if (find) {
      query.$or = [
        { estadio: { $regex: find, $options: 'i' } },
        { categoria: { $regex: find, $options: 'i' } }
      ];
    }
    Partido
      .find(query)
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
  Partido.findById(req.params.id)
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

// Agrega un partido a la bd
router.post('/partidos',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const torneo = _.get(req, 'body.partido.torneo._id', false) || false;
    const equipoA = _.get(req, 'body.partido.equipoA._id', false) || false;
    const equipoB = _.get(req, 'body.partido.equipoB._id', false) || false;
    const fechaInicio = _.get(req, 'body.partido.fechaInicio', false) || false;
    const estadio = _.get(req, 'body.partido.estadio', false) || false;
    const estado = _.get(req, 'body.partido.estado', false) || false;
    const categoria = _.get(req, 'body.partido.categoria', false) || false;
    // const destacado = _.get(req,'body.partido.destacado',false) || false;
    const arbitros = _.get(req, 'body.partido.arbitros', false) || false;

    if (equipoA && equipoB && torneo && equipoA !== equipoB) {
      const marcador = new Marcador({
        golesEquipoA: 0,
        golesEquipoB: 0
      });
      marcador.save(function (err, marcador_db) {
        if (err || !marcador_db) { return console.error(err); }
        // console.log(req.body);
        const partido = new Partido({
          torneo: torneo,
          equipoA: equipoA,
          equipoB: equipoB,
          marcador: marcador_db._id,
          estado: estado,
          // eventos: [],
          fechaInicio: fechaInicio,
          // fechaDescanso: null,
          estadio: estadio,
          categoria: categoria,
          arbitros: arbitros,
          // destacado: destacado
        });
        partido.save((err, partido_db) => {
          if (err || !partido_db) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos crear el partido :(");
          } else {
            return sendRes(res, 200, partido_db, "Success", null);
          }
        });
      });
    } else {
      return sendRes(res, 402, null, equipoA !== equipoB ? "Parametros requeridos: equipoA, equipoB, torneo" : "Equipos no validos", null);
    }
  });

// Modifica un partido en la bd
router.put('/partidos/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const torneo = _.get(req, 'body.partido.torneo._id', false) || false;
    const equipoA = _.get(req, 'body.partido.equipoA._id', false) || false;
    const equipoB = _.get(req, 'body.partido.equipoB._id', false) || false;
    const fechaInicio = _.get(req, 'body.partido.fechaInicio', false) || false;
    const estadio = _.get(req, 'body.partido.estadio', false) || false;
    const estado = _.get(req, 'body.partido.estado', false) || false;
    const categoria = _.get(req, 'body.partido.categoria', false) || false;
    // const destacado = _.get(req,'body.partido.destacado',false) || false;
    const arbitros = _.get(req, 'body.partido.arbitros', false) || false;

    if (equipoA && equipoB && torneo) {
      Partido
        .findById(req.params.id)
        .exec(function (err, partido) {
          if (err || !partido) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el partido :(");
          } else {
            partido.torneo = torneo;
            partido.equipoA = equipoA;
            partido.equipoB = equipoB;
            partido.estado = estado;
            partido.fechaInicio = fechaInicio;
            // fechaDescanso: null,
            partido.estadio = estadio;
            partido.categoria = categoria;
            partido.arbitros = arbitros;
            // partido.destacado= destacad;
            partido.save(function (err, partido_db) {
              if (err || !partido_db) {
                return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el partdio :(");
              } else {
                return sendRes(res, 200, partido, "Success", null);
              }
            });
          }
        });
    } else {
      return sendRes(res, 402, null, "Parametros requeridos: equipoA, equipoB, torneo", null);
    }
  });

//Borra un partido de la bd
router.delete('/partidos/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Partido.deleteOne({ _id: req.params.id }, function (err, partido_db) {
      if (err || !partido_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el partido :(");
      } else {
        return sendRes(res, 200, partido_db, "Success", null);
      }
    });
  });

// Modifica un partido en la bd
router.put('/partido-aztualizar/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    console.log(req.body);
    Partido
      .findById(req.params.id)
      .populate({
        path: 'marcador',
        model: Marcador
      })
      .exec(function (err, partido_db) {
        if (err || !partido_db) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el partido :(");
        } else {
          const golesEquipoA = _.get(req, 'doby.partido.marcador.golesEquipoA', partido_db.marcador.golesEquipoA) || partido_db.marcador.golesEquipoA;
          const golesEquipoB = _.get(req, 'doby.partido.marcador.golesEquipoB', partido_db.marcador.golesEquipoB) || partido_db.marcador.golesEquipoB;
          const estado = _.get(req, 'doby.partido.estado', partido_db.estado) || partido_db.estado;
          partido_db.estado = estado;
          const selectTipoEventos = _.get(req, 'doby.partido.selectTipoEventos', null);
          partido_db.eventos.push({
            evento: selectTipoEventos._id,
            fecha: new Date()
          });
          partido_db.markModified('eventos');

          Marcador
            .findById(partido_db.marcador._id)
            .exec(function (err, marcador_db) {
              if (err || !marcador_db) {
                return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el partido :(");
              } else {
                marcador_db.golesEquipoA = golesEquipoA;
                marcador_db.golesEquipoB = golesEquipoB;
                marcador_db.save((err) => {
                  if (err) {
                    return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el partido :(");
                  } else {
                    partido_db.seve((err, partido_save_db) => {

                      if (err) {
                        return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el partido :(");
                      } else {
                        return sendRes(res, 200, partido_save_db, "Success", null);
                      }
                    });
                  }
                });
              }
            });
        }
      });
  });

module.exports = router;
