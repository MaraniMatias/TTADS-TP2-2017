"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const passport = require('passport');
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
    const apellido = _.get(req, 'query.apellido', false) || false;
    let query = {}
    if (nombre || apellido) {
      query.$or = [
        { nombre: { $regex: nombre, $options: 'i' } },
        { apellido: { $regex: apellido, $options: 'i' } }
      ];
    }
    MiembroCuerpoTecnico
      .find(query)
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
  });

router.get('/miembros-cuerpo-tecnico/:id', function (req, res) {
  // Validar parámetro de la consulta
    MiembroCuerpoTecnico.findById(req.params.id)
      .then(function (miembroCuerpoTecnico) {
        // res, status, data, messager, error
        return sendRes(res, 200, miembroCuerpoTecnico, "Success", null);
      })
      .catch(function (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, "Ha ocurrido un error", err);
      });
});

//Agrega un miembro de cuerpo tecnico a la bd
router.post('/miembros-cuerpo-tecnico',
passport.authenticate('jwt', { session: false }),
function (req, res) {
  const nombre = _.get(req, 'body.cuerpo-tecnico.nombre', false) || false;
  const apellido = _.get(req, 'body.cuerpo-tecnico.apellido', false) || false;

  if(nombre && apellido){
    const cuerpoTecnico = new MiembroCuerpoTecnico({
      nombre: nombre,
      apellido: apellido
    });
    cuerpoTecnico.save((err, cuerpoTecnico_db) => {
      if (error || !cuerpoTecnico_db) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, 'Error', error || "No pudimos crear al miembro del cuerpo tecnico :(");
      } else {
        // res, status, data, messager, error
        return sendRes(res, 200, cuerpoTecnico_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "Parameros requeridos: nombre, apellido", null);
  }
});

//Modifica un miembro de cuerpo tecnico en la bd
router.put('/miembros-cuerpo-tecnico/:id',
  passport.authenticate('jwt', { session: false }),
 function (req, res) {
   const nombre = _.get(req, 'body.cuerpo-tecnico.nombre', false) || false;
   const apellido = _.get(req, 'body.cuerpo-tecnico.apellido', false) || false;
   if(nombre && apellido){
     MiembroCuerpoTecnico
      .findById(req.params.id)
      .exec(function(err, cuerpoTecnico){
        if (err || !cuerpoTecnico) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar al miembro del cuerpo tecnico :(");
        } else {
          cuerpoTecnico.nombre = nombre;
          cuerpoTecnico.apellido = apellido;
          cuerpoTecnico.save(function (err, cuerpoTecnico_db) {
            if (err || !cuerpoTecnico_db) {
              return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar al miembro del cuerpo tecnico :(");
            } else {
              return sendRes(res, 200, cuerpoTecnico, "Success", null);
            }
          });
        }
      });
   }else {
     // res, status, data, messager, error
     return sendRes(res, 402, null, "Parameros requeridos: nombre, apellido", null);
   }
});

//Borra un miembro de cuerpo tecnico de la bd
router.delete('/miembros-cuerpo-tecnico/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    MiembroCuerpoTecnico.deleteOne({ _id: req.params.id }, function(err, cuerpoTecnico_db){
      if (err || !cuerpoTecnico_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar al miembro del cuerpo tecnico :(");
      } else {
        return sendRes(res, 200, cuerpoTecnico_db, "Success", null);
      }
    });
});

module.exports = router;
