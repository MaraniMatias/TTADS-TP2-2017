var express = require('express');
var router = express.Router();

//Recupera todos los partidos
router.get('/partidos',function(req,res){
  res.send({type: 'GET'})
})

//Agrega un partido a la bd
router.post('/partidos',function(req,res){
  res.send({type: 'POST'})
})

//Modifica un partido en la bd
router.put('/partidos/:id',function(req,res){
  res.send({type: 'PUT'})
})

//Borra un partido de la bd
router.delete('/partidos/:id',function(req,res){
  res.send({type: 'DELETE'})
})

module.exports = router;
