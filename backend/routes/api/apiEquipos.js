var express = require('express');
var router = express.Router();
var Equipo = require('../../models/equipo');

//Recupera todos los equipos
router.get('/equipos',function(req,res){
  res.send({type: 'GET'})
});

//Agrega un equipo a la bd
router.post('/equipos',function(req,res){
  //El create crea un objeto Equipo con los datos del request y lo guarda en bd
  //Equipo.create devuelve un promise que lo uso para asegurarme que la insercion
  //se hizo correctamente
  Equipo.create(req.body).then(function(equipo){
    res.send(equipo)
  });
});

//Modifica un equipo en la bd
router.put('/equipos/:id',function(req,res){
  res.send({type: 'PUT'})
});

//Borra un equipo de la bd
router.delete('/equipos/:id',function(req,res){
  res.send({type: 'DELETE'})
});

module.exports = router;
