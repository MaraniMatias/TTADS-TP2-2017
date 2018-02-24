var express = require('express');
var router = express.Router();
var Partido = require('../../models/partido');


//Recupera un partido
router.get('/partidos/:id',function(req,res){
  Partido.findById({_id: req.params.id})
  .populate('equipos')
  .populate('eventos')
  .populate('marcador')
  .exec(function (err, partido) {
    if (err || !partido) {
      return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
    } else {
      return res.status(200).send(partido);
    }
  });
});

//Recupera todos los partidos
router.get('/partidos',function(req,res){
  if(req.query.equipo === undefined){
    console.log(req.query.equipo);
    Partido.find({})
    .populate('equipos')
    .populate('eventos')
    .populate('marcador')
    .exec(function (err, partidos) {
      if (err || !partidos) {
        return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
      } else {
        return res.status(200).send(partidos);
      }
    });
  }else{
    console.log(req.query.equipo);
    Partido.find({"equipos":{"_id": req.query.equipo }})
    .populate('equipos')
    .populate('eventos')
    .populate('marcador')
    .exec(function (err, partidos) {
      if (err || !partidos) {
        return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
      } else {
        return res.status(200).send(partidos);
      }
    });
  }
});



//Agrega un partido a la bd
router.post('/partidos',function(req,res,next){
  Partido.create(req.body).then(function(partido){
    res.status(200).send(partido);
  }).catch(next);
});

//Modifica un partido en la bd
router.put('/partidos/:id',function(req,res){
  Partido.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Partido.findOne({_id: req.params.id})
    .populate('equipos')
    .populate('eventos')
    .populate('marcador')
    .exec(function (err, partido) {
      if (err || !partido) {
        return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
      } else {
        return res.status(200).send(partido);
      }
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
