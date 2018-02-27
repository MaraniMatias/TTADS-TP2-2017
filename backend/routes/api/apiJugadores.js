"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Jugador = require('../../models/jugador');

// Recupera todos los jugadores
// Buscar jugadores por nomnbre o apellido
// query parameter skip limit player
// http://localhost:3000/api/jugadores?jugador=a&skip=1&limit=1
router.get('/jugadores',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetro de la consulta
    const nombre = _.get(req, 'query.jugador', false) || false;

    if (nombre) {
      Jugador.find({
          $or: [
            { nombre: { $regex: nombre, $options: 'i' } },
            { apellido: { $regex: nombre, $options: 'i' } }
          ]
        })
        .select('nombre apellido')
        .sort('apellido')
        .skip(req.query.skip)
        .limit(req.query.limit)
        .exec(function (err, jugadores) {
          if (err) {
            // res, status, data, messager, error
            return sendRes(res, 500, [], "Ha ocurrido un error", err);
          } else {
            // res, status, data, messager, error
            return sendRes(res, 200, jugadores || [], "Success", null);
          }
        });
    } else {
      // res, status, data, messager, error
      return sendRes(res, 402, [], "Parametro 'jugador' es requerido", null);
    }
  });

router.get('/jugadores/:id', function (req, res) {
  // Validar parámetro de la consulta
  const id = _.get(req, 'params.id', false) || false;
  if (id) {
    Jugador.findById(id)
      .then(function (jugador) {
        // res, status, data, messager, error
        return sendRes(res, 200, jugador, "Success", null);
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

//Agrega un jugador a la bd
router.post('/jugadores',function(req,res,next){
  Jugador.create(req.body).then(function(jugadores){
    res.status(200).send(jugadores);
  }).catch(next);
});

//Modifica un jugador en la bd
router.put('/jugadores/:id',function(req,res){
  Jugador.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Jugador.findOne({_id: req.params.id}).then(function(jugadores){
      res.status(200).send(jugadores);
    });
  });
});

//Borra un jugador de la bd
router.delete('/jugadores/:id',function(req,res){
  Jugador.findByIdAndRemove({_id: req.params.id}).then(function(jugadores){
    res.status(200).send(jugadores);
  });
});

module.exports = router;
