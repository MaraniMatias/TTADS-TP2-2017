"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Equipo = require('../../models/equipo');

// Recupera todos los equipos
// query parameter skip limit player
// http://localhost:3000/api/equipos?jugador=a&skip=1&limit=1
router.get('/equipos',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetro de la consulta
    const nombre = _.get(req, 'query.nombre', false) || false;
    let query = {}
    if (nombre) {
      query.nombre = { $regex: nombre, $options: 'i' };
    }
    Equipo
      .find(query)
      .select('nombre escudoURL')
      .sort('nombre')
      .skip(req.query.skip)
      .limit(req.query.limit)
      .exec(function (err, equipos) {
        if (err) {
          // res, status, data, messager, error
          return sendRes(res, 500, [], "Ha ocurrido un error", err);
        } else {
          // res, status, data, messager, error
          return sendRes(res, 200, equipos || [], "Success", null);
        }
      });
  });

router.get('/equipos/:id', function (req, res) {
  // Validar parámetro de la consulta
  const id = _.get(req, 'params.id', false) || false;
  if (id) {
    Equipo.findById(id)
      .populate('jugadores', 'nombre apellido')
      .populate('cuerpoTecnico', 'nombre apellido')
      .then(function (equipo) {
        // res, status, data, messager, error
        return sendRes(res, 200, equipo, "Success", null);
      })
      .catch(function (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, "Ha ocurrido un error", err);
      });
  } else {
    // res, status, data, messager, error
    return sendRes(res, 402, null, "Parametro ID del evento es requerido", null);
  }
});

//Agrega un equipo a la bd
router.post('/equipos', function (req, res, next) {
  //El create crea un objeto Equipo con los datos del request y lo guarda en bd
  //Equipo.create devuelve un promise que lo uso para asegurarme que la insercion
  //se hizo correctamente
  const nombre = _.get(req,'req.body.nombre',false) || false;
  const jugadores = _.get(req,'req.body.jugadores',false) || false;
  const cuerpoTecnico = _.get(req,'req.body.cuerpoTecnico',false) || false;
  if(nombre && jugadores && cuerpoTecnico){
    const equipo = new Equipo({
      nombre: nombre,
      escudoURL: `https://api.adorable.io/avatars/128/${getRandomInt(1000)}.png`,
      jugadores: jugadores,
      cuerpoTecnico: cuerpoTecnico
    });
    equipo.save((error,equipo_db)=>{
      if (error || !equipo_db) {
        return sendRes(res, 500, null, 'Error', error || "No pudimos crear el equipo :(");
      }else{
        return sendRes(res, 200, equipo_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "Los parametros nombre, jugadores y cuerpoTecnico son requeridos", null);
  }
});

//Modifica un equipo en la bd
router.put('/equipos/:id', function (req, res) {

  const id = _.get(req, 'params.id', false) || false;
  if(id){
    Equipo.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
      Equipo.findOne({ _id: req.params.id })
        .populate('jugadores')
        .populate('cuerpoTecnico')
        .exec(function (err, equipo_db) {
          if (err || !equipo_db) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el equipo :(");
          } else {
            return sendRes(res, 200, equipo_db, "Success", null);
          }
        });
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

//Borra un equipo de la bd
router.delete('/equipos/:id', function (req, res, next) {
  //findByIdAndRemove busca la propiedad _id en Mongo y elimina el objeto
  const id = _.get(req, 'params.id', false) || false;
  if(id){
    Equipo.findByIdAndRemove({ _id: req.params.id }, function(err, equipo_db){
      if (err || !equipo_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el equipo :(");
      } else {
        return sendRes(res, 200, equipo_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

module.exports = router;
