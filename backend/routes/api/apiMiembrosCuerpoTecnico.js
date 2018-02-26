"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const MiembroCuerpoTecnico = require('../../models/miembroCuerpoTecnico');

// Recupera todos los miembros del cuerpo tecnico
// query parameter skip limit player
// http://localhost:3000/api/miembros-cuerpo-tecnico?nombre=a&skip=1&limit=1
router.get('/miembros-cuerpo-tecnico',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetro de la consulta
    const nombre = _.get(req, 'query.nombre', false) || false;

    if (nombre) {
      MiembroCuerpoTecnico.find({
          $or: [
            { nombre: { $regex: nombre, $options: 'i' } },
            { apellido: { $regex: nombre, $options: 'i' } }
          ]
        })
        .select('nombre apellido')
        .sort('apellido')
        .skip(req.query.skip)
        .limit(req.query.limit)
        .exec(function (err, miembrosCuerpoTecnico) {
          if (err) {
            // res, status, data, messager, error
            return sendRes(res, 500, [], "Ha ocurrido un error", err);
          } else {
            // res, status, data, messager, error
            return sendRes(res, 200, miembrosCuerpoTecnico, "Success", null);
          }
        });
    } else {
      // res, status, data, messager, error
      return sendRes(res, 402, [], "Parametro 'nombre' es requerido", null);
    }
  });

router.get('/miembros-cuerpo-tecnico/:id', function (req, res) {
  // Validar parámetro de la consulta
  const id = _.get(req, 'params.id', false) || false;
  if (id) {
    MiembroCuerpoTecnico.findById(id)
      .then(function (miembrosCuerpoTecnico) {
        // res, status, data, messager, error
        return sendRes(res, 200, miembrosCuerpoTecnico, "Success", null);
      })
      .catch(function (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, "Ha ocurrido un error", err);
      });
  } else {
    // res, status, data, messager, error
    return sendRes(res, 402, null, "Parametro id del evento es requerido", null);
  }
});

//Agrega un miembro de cuerpo tecnico a la bd
router.post('/miembros-cuerpo-tecnico',function(req,res,next){
  MiembroCuerpoTecnico.create(req.body).then(function(miembrosCuerpoTecnico){
    res.status(200).send(miembrosCuerpoTecnico);
  }).catch(next);
});

//Modifica un miembro de cuerpo tecnico en la bd
router.put('/miembros-cuerpo-tecnico/:id',function(req,res){
  MiembroCuerpoTecnico.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    MiembroCuerpoTecnico.findOne({_id: req.params.id}).then(function(miembrosCuerpoTecnico){
      res.status(200).send(miembrosCuerpoTecnico);
    });
  });
});

//Borra un miembro de cuerpo tecnico de la bd
router.delete('/miembros-cuerpo-tecnico/:id',function(req,res){
  MiembroCuerpoTecnico.findByIdAndRemove({_id: req.params.id}).then(function(miembrosCuerpoTecnico){
    res.status(200).send(miembrosCuerpoTecnico);
  });
});

module.exports = router;
