"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const TipoEvento = require('../../models/tipoEvento')

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

// Recupera todos los tipos de evento
router.get('/tipos-evento',function(req,res){
  TipoEvento.find({}).then(function(tiposEvento){
    res.status(200).send(tiposEvento)
  });
});

// Agrega un tipo de evento a la bd
router.post('/tipos-evento',function(req,res,next){
  TipoEvento.create(req.body).then(function(tipoEvento){
    res.status(200).send(tipoEvento);
  }).catch(next);
});

// Modifica un tipo de evento en la bd
router.put('/tipos-evento/:id',function(req,res){
  TipoEvento.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    TipoEvento.findOne({_id: req.params.id}).then(function(tipoEvento){
      res.status(200).send(tipoEvento);
    });
  });
});

//Borra un tipo de evento de la bd
router.delete('/tipos-evento/:id',function(req,res){
  TipoEvento.findByIdAndRemove({_id: req.params.id}).then(function(tipoEvento){
    res.status(200).send(tipoEvento);
  });
});

module.exports = router;
