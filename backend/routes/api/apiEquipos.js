var express = require('express');
var router = express.Router();
var Equipo = require('../../models/equipo');

//Recupera todos los equipos
router.get('/equipos',function(req,res){
  Equipo.find([]).then(function(equipos){
    res.send(equipos);
  });
});

//Agrega un equipo a la bd
router.post('/equipos',function(req,res,next){
  //El create crea un objeto Equipo con los datos del request y lo guarda en bd
  //Equipo.create devuelve un promise que lo uso para asegurarme que la insercion
  //se hizo correctamente
  Equipo.create(req.body).then(function(equipo){
    res.send(equipo)
  }).catch(next);
});

//Modifica un equipo en la bd
router.put('/equipos/:id',function(req,res){
  Equipo.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Equipo.findOne({_id: req.params.id}).then(function(equipo){
      res.send(equipo);
    });
  });
});

//Borra un equipo de la bd
router.delete('/equipos/:id',function(req,res,next){
  //findByIdAndRemove busca la propiedad _id en Mongo y elimina el objeto
  Equipo.findByIdAndRemove({_id: req.params.id}).then(function(equipo){
    res.send(equipo);
  });
});

module.exports = router;
