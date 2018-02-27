const express = require('express');
const router = express.Router();
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Torneo = require('../../models/torneo');

//Recupera todos los tipos de evento
router.get('/torneos',function(req,res){
  if(req.query.nombre === undefined){
    Torneo.find({})
      .populate('equipos')
      .populate('partidos')
      .exec(function (err, torneos) {
        if (err || !torneos) {
          return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
        } else {
          return res.status(200).send(torneos);
        }
      });
  }else{
    Torneo.find({nombre: {$regex: req.query.nombre }})
      .populate('equipos')
      .populate('partidos')
      .exec(function (err, torneos) {
        if (err || !torneos) {
          return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
        } else {
          return res.status(200).send(torneos);
        }
      });
  }
});

router.get('/torneos/:id',function(req,res){
  Torneo.findById({_id: req.params.id})
    .populate('equipos')
    .populate('partidos')
    .exec(function (err, torneos) {
      if (err || !torneos) {
        return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
      } else {
        return res.status(200).send(torneos);
      }
    });
});

//Agrega un tipo de evento a la bd
router.post('/torneos',function(req,res,next){
  Torneo.create(req.body).then(function(torneo){
    res.status(200).send(torneo);
  }).catch(next);
});

//Modifica un tipo de evento en la bd
router.put('/torneos/:id',function(req,res){
  Torneo.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Torneo.findOne({_id: req.params.id}).then(function(torneo){
      res.status(200).send(torneo);
    });
  });
});

//Borra un tipo de evento de la bd
router.delete('/torneos/:id',function(req,res){
  Torneo.findByIdAndRemove({_id: req.params.id}).then(function(torneo){
    res.status(200).send(torneo);
  });
});

module.exports = router;
