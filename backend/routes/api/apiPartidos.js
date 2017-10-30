var express = require('express');
var router = express.Router();
Partido = require('../../models/partido');

//Recupera todos los partidos
router.get('/partidos',function(req,res){
  Partido.find([]).then(function(partidos){
    res.send(partidos);
  })
});

//Agrega un partido a la bd
router.post('/partidos',function(req,res){
  Partido.create(req.body).then(function(partido){
    res.send(partido);
  }).catch(next);
});

//Modifica un partido en la bd
router.put('/partidos/:id',function(req,res){
  Partido.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Parido.findOne({_id: req.params.id}).then(function(partido){
      res.send(partido);
    });
  });
});

//Borra un partido de la bd
router.delete('/partidos/:id',function(req,res){
  Partido.findByIdAndRemove({_id: req.params.id}).then(function(partido){
    res.send(partido);
  });
});

module.exports = router;
