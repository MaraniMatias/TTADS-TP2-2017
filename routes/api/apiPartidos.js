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
    const equipoA = _.get(req,'req.body.equipoA',false) || false;
    const equipoB = _.get(req,'req.body.equipoB',false) || false;
    const fechaInicio = _.get(req,'req.body.fechaInicio',false) || false;
    const estadio = _.get(req,'req.body.estadio',false) || false;
    const categoria = _.get(req,'req.body.categoria',false) || false;
    const destacado = _.get(req,'req.body.destacado',false) || false;

    if(equipoA && equipoB && fechaInicio && estadio && categoria && destacado){
      const marcador = new Marcador({
        golesEquipoA: 0,
        golesEquipoB: 0
      });
      marcador.save(function (err, marcador_db) {
        if (err || !marcador_db) { return console.error(err); }
        console.log(req.body);
        const partido = new Partido({
          "equipoA": req.body.equipoA,
          "equipoB": req.body.equipoB,
          "marcador": marcador_db,
          "estado": 'Programado',
          "eventos": [],
          "fechaInicio": req.body.fechaInicio,
          "fechaDescanso": null,
          "estadio": req.body.estadio,
          "categoria": req.body.categoria,
          "arbitros": [],
          "destacado": req.body.destacado
      });
      partido.save((error,partido_db)=>{
        if (err || !partido_db) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos crear el partido :(");
        }else{
          return sendRes(res, 200, partido_db, "Success", null);
        }
      });
    });
  }else{
    return sendRes(res, 402, null, "Los parametros equipoA, equipoB, fechaInicio, estadio, categoria y destacado son requeridos", null);
  }
});

//Modifica un partido en la bd
router.put('/partidos/:id', function (req, res) {
  const id = _.get(req, 'params.id', false) || false;
  if(id){
    Partido.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
      Partido.findOne({ _id: req.params.id })
        .populate('equipos')
        .populate('eventos')
        .populate('marcador')
        .exec(function (err, partido_db) {
          if (err || !partido_db) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el partido :(");
          } else {
            return sendRes(res, 200, partido_db, "Success", null);
          }
        });
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

//Borra un partido de la bd
router.delete('/partidos/:id', function (req, res) {
  const id = _.get(req, 'params.id', false) || false;
  if(id){
    Partido.findByIdAndRemove({ _id: req.params.id }, function(err,partido_db){
      if (err || !partido_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el partido :(");
      } else {
        return sendRes(res, 200, partido_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

module.exports = router;
