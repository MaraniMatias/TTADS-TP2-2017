var express = require('express');
var router = express.Router();
var Equipo = require('../../models/equipo');

// Recupera todos los equipos
router.get('/equipos', function (req, res) {
  if(req.query.nombre != undefined){
    Equipo.find({nombre: {$regex: req.query.nombre }})
      .populate('jugadores')
      .populate('cuerpoTecnico')
      .exec(function (err, equipos) {
        if (err || !equipos) {
          return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
        } else {
          return res.status(200).send(equipos);
        }
      });
  }else{
    Equipo.find({})
      .populate('jugadores')
      .populate('cuerpoTecnico')
      .exec(function (err, equipos) {
        if (err || !equipos) {
          return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
        } else {
          return res.status(200).send(equipos);
        }
      });
  }

});



router.get('/equipos/:id',function(req,res){
  Equipo.findById({_id: req.params.id})
  .populate('jugadores')
  .populate('cuerpoTecnico')
  .exec(function (err, equipos) {
    if (err || !equipos) {
      return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
    } else {
      return res.status(200).send(equipos);
    }
  });
});

//Agrega un equipo a la bd
router.post('/equipos',function(req,res,next){
  //El create crea un objeto Equipo con los datos del request y lo guarda en bd
  //Equipo.create devuelve un promise que lo uso para asegurarme que la insercion
  //se hizo correctamente
  Equipo.create(req.body).then(function(equipo){
    res.status(200).send(equipo)
  }).catch(next);
});

//Modifica un equipo en la bd
router.put('/equipos/:id',function(req,res){
  Equipo.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Equipo.findOne({_id: req.params.id})
    .populate('jugadores')
    .populate('cuerpoTecnico')
    .exec(function (err, equipos) {
      if (err || !equipos) {
        return res.status(500).send({ msg: 'Ha ocurrido un error al popular', err: err });
      } else {
        return res.status(200).send(equipos);
      }
    });
  });
});

//Borra un equipo de la bd
router.delete('/equipos/:id',function(req,res,next){
  //findByIdAndRemove busca la propiedad _id en Mongo y elimina el objeto
  Equipo.findByIdAndRemove({_id: req.params.id}).then(function(equipo){
    res.status(200).send(equipo);
  });
});

module.exports = router;
