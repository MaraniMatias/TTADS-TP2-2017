"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const TipoEvento = require('../../models/tipoEvento')

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
