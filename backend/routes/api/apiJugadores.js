var express = require('express');
var router = express.Router();
Jugador = require('../../models/jugador');

//Recupera todos los jugadores
router.get('/jugadores',function(req,res){
  Jugador.find({}).then(function(jugadores){
    res.status(200).send(jugadores)
  });
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
