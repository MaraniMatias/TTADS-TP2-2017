var express = require('express');
var router = express.Router();

//Recupera todos los tipos de evento
router.get('/tiposEvento',function(req,res){
  res.send({type: 'GET'})
})

//Agrega un tipo de evento a la bd
router.post('/tiposEvento',function(req,res){
  console.log(req.body);
  res.send({type: 'POST'})
})

//Modifica un tipo de evento en la bd
router.put('/tiposEvento/:id',function(req,res){
  res.send({type: 'PUT'})
})

//Borra un tipo de evento de la bd
router.delete('/tiposEvento/:id',function(req,res){
  res.send({type: 'DELETE'})
})

module.exports = router;
