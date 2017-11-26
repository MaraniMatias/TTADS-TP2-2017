var express = require('express');
var router = express.Router();
Partido = require('../../models/partido');

//Recupera todos los partidos
router.get('/partidos',function(req,res){
  Partido.find([]).then(function(partidos){
    res.status(200).send(partidos);
  })
});

//Agrega un partido a la bd
router.post('/partidos',function(req,res,next){
  console.log(req.body);
  Partido.create(req.body).then(function(partido){
    res.status(200).send(partido);
  }).catch(next);
});

//Modifica un partido en la bd
router.put('/partidos/:id',function(req,res){
  Partido.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Partido.findOne({_id: req.params.id}).then(function(partido){
      res.status(200).send(partido);
    });
  });
});

//Borra un partido de la bd
router.delete('/partidos/:id',function(req,res){
  Partido.findByIdAndRemove({_id: req.params.id}).then(function(partido){
    res.status(200).send(partido);
  });
});

module.exports = router;
