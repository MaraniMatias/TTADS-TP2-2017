"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const passport = require('passport');
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
  Equipo.findById(req.params.id)
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
});

// Agrega un equipo a la bd
router.post('/equipos',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const nombre = _.get(req, 'body.equipo.nombre', false) || false;
    const escudoURL = _.get(req, 'body.equipo.escudoURL', null);
    const jugadores = _.get(req, 'body.equipo.jugadores', false) || false;
    const cuerpoTecnico = _.get(req, 'body.equipo.cuerpoTecnico', false) || false;

    if (nombre && jugadores && cuerpoTecnico) {
      const equipo = new Equipo({
        nombre: nombre,
        escudoURL: escudoURL,
        jugadores: jugadores,
        cuerpoTecnico: cuerpoTecnico
      });
      equipo.save((error, equipo_db) => {
        if (error || !equipo_db) {
          return sendRes(res, 500, null, 'Error', error || "No pudimos crear el equipo :(");
        } else {
          return sendRes(res, 200, equipo_db, "Success", null);
        }
      });
    } else {
      return sendRes(res, 402, null, "Parameros requeridos: nombre, jugadores y cuerpoTecnico", null);
    }
  });

// Modifica un equipo en la bd
router.put('/equipos/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const nombre = _.get(req, 'body.nombre', equipo.nombre) || equipo.nombre;
    const escudoURL = _.get(req, 'body.escudoURL', equipo.escudoURL) || equipo.escudoURL;
    const jugadores = _.get(req, 'body.jugadores', equipo.jugadores) || equipo.jugadores;
    const cuerpoTecnico = _.get(req, 'body.cuerpoTecnico', equipo.cuerpoTecnico) || equipo.cuerpoTecnico;
    if(nombre && escudoURL && jugadores && cuerpoTecnico){
      Equipo
        .findById(req.params.id)
        .exec(function (err, equipo) {
          if (err || !equipo) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el equipo :(");
          } else {
            equipo.nombre = nombre;
            equipo.escudoURL = escudoURL;
            equipo.jugadores = jugadores;
            equipo.cuerpoTecnico = cuerpoTecnico;
            equipo.save(function (err, equipo_db) {
              if (err || !equipo_db) {
                return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el equipo :(");
              } else {
                return sendRes(res, 200, equipo, "Success", null);
              }
            });
          }
        });
    }else{
      return sendRes(res, 402, null, "Parameros requeridos: nombre, jugadores y cuerpoTecnico", null);
    }

  });

// Borra un equipo de la bd
router.delete('/equipos/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    // findByIdAndRemove busca la propiedad _id en Mongo y elimina el objeto
    Equipo.deleteOne(req.params.id, function (err, equipo_db) {
      if (err || !equipo_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el equipo :(");
      } else {
        return sendRes(res, 200, equipo_db, "Success", null);
      }
    });
  });

module.exports = router;
