"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Equipo = require('../../models/equipo');

// Solo con el objetivo de enviar siempre una misma respuesta
function sendRes(res, cod, data, message, error) {
  res.status(cod);
  return res.json({ data, message, error });
}

// Normalizar parametros para el paginado
function queryPage(req, res, next) {
  // en caso de no estar definido se fuersa a 0
  const skip = _.get(req, 'query.skip', 0) || 0;
  // en caso de no estar definido se fuersa a 15
  let limit = _.get(req, 'query.limit', 15) || 15;
  limit = parseInt(limit, 10);
  req.query.skip = parseInt(skip, 10);
  req.query.limit = limit > 0 ? limit : 15;
  // Continuar con la consulta ala API
  next();
}

// Recupera todos los equipos
// query parameter skip limit player
// http://localhost:3000/api/equipos?jugador=a&skip=1&limit=1
router.get('/equipos',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetro de la consulta
    const nombre = _.get(req, 'query.nombre', false) || false;
    if (nombre) {
      Equipo.find({
          nombre: { $regex: nombre, $options: 'i' }
        })
        .select('nombre')
        .sort('nombre')
        .skip(req.query.skip)
        .limit(req.query.limit)
        .exec(function (err, equipos) {
          if (err) {
            // res, status, data, messager, error
            return sendRes(res, 500, [], "Ha ocurrido un error", err);
          } else {
            // res, status, data, messager, error
            return sendRes(res, 200, equipos, "Success", null);
          }
        });
    } else {
      // res, status, data, messager, error
      return sendRes(res, 402, [], "Parametro 'nombre' es requerido", null);
    }
  });

router.get('/equipos/:id', function (req, res) {
  // Validar parámetro de la consulta
  const id = _.get(req, 'params.id', false) || false;
  if (id) {
    Equipo.findById(id)
      .populate('jugadores', 'nombre apellido')
      .populate('cuerpoTecnico', 'nombre apellido')
      .then(function (equipo) {
        // res, status, data, messager, error
        return sendRes(res, 200, equipo, "Success", null);
      })
      .catch(function (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, "Ha ocurrido un error", err);
      });
  } else {
    // res, status, data, messager, error
    return sendRes(res, 402, null, "Parametro 'jugador' es requerido", null);
  }
});

//Agrega un equipo a la bd
router.post('/equipos',function(req,res,next){
  //El create crea un objeto Equipo con los datos del request y lo guarda en bd
  //Equipo.create devuelve un promise que lo uso para asegurarme que la insercion
  //se hizo correctamente
  Equipo.create(req.body).then(function(equipo){
    res.status(200).send(equipo)
  }).catch(next);
});

//Modifica un equipo en la bd
router.put('/equipos/:id',function(req,res){
  Equipo.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Equipo.findOne({_id: req.params.id})
    .populate('jugadores')
    .populate('cuerpoTecnico')
    .exec(function (err, equipos) {
      if (err || !equipos) {
        return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
      } else {
        return res.status(200).send(equipos);
      }
    });
  });
});

//Borra un equipo de la bd
router.delete('/equipos/:id',function(req,res,next){
  //findByIdAndRemove busca la propiedad _id en Mongo y elimina el objeto
  Equipo.findByIdAndRemove({_id: req.params.id}).then(function(equipo){
    res.status(200).send(equipo);
  });
});

module.exports = router;
