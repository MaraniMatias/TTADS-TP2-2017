var express = require('express');
var router = express.Router();

//Recupera todos los equipos
router.get('/equipos',function(req,res){
  res.send({type: 'GET'})
})

//Agrega un equipo a la bd
router.post('/equipos',function(req,res){
  console.log(req.body);
  res.send({type: 'POST'})
})

//Modifica un equipo en la bd
router.put('/equipos/:id',function(req,res){
  res.send({type: 'PUT'})
})

//Borra un equipo de la bd
router.delete('/equipos/:id',function(req,res){
  res.send({type: 'DELETE'})
})

module.exports = router;
