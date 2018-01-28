var express = require('express');
var router = express.Router();
MiembroCuerpoTecnico = require('../../models/miembroCuerpoTecnico');

//Recupera todos los miembros del cuerpo tecnico
router.get('/miembrosCuerpoTecnico',function(req,res){
  MiembroCuerpoTecnico.find({}).then(function(miembrosCuerpoTecnico){
    res.status(200).send(miembrosCuerpoTecnico)
  });
});

//Agrega un miembro de cuerpo tecnico a la bd
router.post('/miembrosCuerpoTecnico',function(req,res,next){
  MiembroCuerpoTecnico.create(req.body).then(function(miembrosCuerpoTecnico){
    res.status(200).send(miembrosCuerpoTecnico);
  }).catch(next);
});

//Modifica un miembro de cuerpo tecnico en la bd
router.put('/miembrosCuerpoTecnico/:id',function(req,res){
  MiembroCuerpoTecnico.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    MiembroCuerpoTecnico.findOne({_id: req.params.id}).then(function(miembrosCuerpoTecnico){
      res.status(200).send(miembrosCuerpoTecnico);
    });
  });
});

//Borra un miembro de cuerpo tecnico de la bd
router.delete('/miembrosCuerpoTecnico/:id',function(req,res){
  MiembroCuerpoTecnico.findByIdAndRemove({_id: req.params.id}).then(function(miembrosCuerpoTecnico){
    res.status(200).send(miembrosCuerpoTecnico);
  });
});

module.exports = router;
