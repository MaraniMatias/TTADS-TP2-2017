var express = require('express');
var router = express.Router();
TipoEvento = require('../../models/tipoEvento')

//Recupera todos los tipos de evento
router.get('/tiposEvento',function(req,res){
  TipoEvento.find({}).then(function(tiposEvento){
    res.send(tiposEvento)
  });
});

//Agrega un tipo de evento a la bd
router.post('/tiposEvento',function(req,res,next){
  TipoEvento.create(req.body).then(function(tipoEvento){
    res.send(tipoEvento);
  }).catch(next);
});

//Modifica un tipo de evento en la bd
router.put('/tiposEvento/:id',function(req,res){
  TipoEvento.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    TipoEvento.findOne({_id: req.params.id}).then(function(tipoEvento){
      res.send(tipoEvento);
    });
  });
});

//Borra un tipo de evento de la bd
router.delete('/tiposEvento/:id',function(req,res){
  TipoEvento.findByIdAndRemove({_id: req.params.id}).then(function(tipoEvento){
    res.send(tipoEvento);
  });
});

module.exports = router;
