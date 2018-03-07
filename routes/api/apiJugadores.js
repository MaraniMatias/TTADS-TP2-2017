"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const passport = require('passport');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Jugador = require('../../models/jugador');

// Recupera todos los jugadores
// Buscar jugadores por nomnbre o apellido
// query parameter skip limit player
// http://localhost:3000/api/jugadores?jugador=a&skip=1&limit=1
router.get('/jugadores',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetro de la consulta
    const nombre = _.get(req, 'query.nombre', false) || false;
    let query = {}
    if (nombre) {
      query.$or = [
        { nombre: { $regex: nombre, $options: 'i' } },
        { apellido: { $regex: nombre, $options: 'i' } }
      ];
    }
    Jugador
      .find(query)
      .select('nombre apellido')
      .sort('apellido')
      .skip(req.query.skip)
      .limit(req.query.limit)
      .exec(function (err, jugadores) {
        if (err) {
          // res, status, data, messager, error
          return sendRes(res, 500, [], "Ha ocurrido un error", err);
        } else {
          // res, status, data, messager, error
          return sendRes(res, 200, jugadores || [], "Success", null);
        }
      });
  });

// Obtener jugador por ID
router.get('/jugadores/:id', function (req, res) {
  Jugador
    .findById(req.params.id)
    .exec(function (err, jugador) {
      if (err || !jugador) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, "Ha ocurrido un error", err);
      } else {
        // res, status, data, messager, error
        return sendRes(res, 200, jugador, "Success", null);
      }
    });
});

// Agrega un jugador a la bd
router.post('/jugadores',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const nombre = _.get(req, 'body.nombre', false) || false;
    const apellido = _.get(req, 'body.apellido', false) || false;
    if (nombre && apellido) {
      const peso = _.get(req, 'body.peso');
      const altura = _.get(req, 'body.altura');
      const edad = _.get(req, 'body.edad');
      const cantGoles = _.get(req, 'body.cantGoles');
      const cantAmarillas = _.get(req, 'body.cantAmarillas');
      const cant2min = _.get(req, 'body.cant2min');
      const cantRojas = _.get(req, 'body.cantRojas');

      const jugador = new Jugador({
        nombre,
        apellido,
        peso,
        altura,
        edad,
        cantGoles,
        cantAmarillas,
        cant2min,
        cantRojas
      });
      jugador.save(function (err, jugador_db) {
        if (err || !jugador_db) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos guardar el jugador :(");
        } else {
          return sendRes(res, 200, jugador_db, "Success", null);
        }
      });
    } else {
      return sendRes(res, 402, null, "Los parametros nombre, apellido  son requeridos", null);
    }
  });

// Modifica un jugador en la bd
router.put('/jugadores/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Jugador
      .findById(req.params.id)
      .exec(function (err, jugador) {
        if (err || !jugador) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el jugador :(");
        } else {
          const nombre = _.get(req, 'body.nombre', jugador.nombre) || jugador.nombre;
          const apellido = _.get(req, 'body.apellido', jugador.apellido) || jugador.apellido;
          const peso = _.get(req, 'body.peso', jugador.peso) || jugador.peso;
          const altura = _.get(req, 'body.altura', jugador.altura) || jugador.altura;
          const edad = _.get(req, 'body.edad', jugador.edad) || jugador.edad;
          const cantGoles = _.get(req, 'body.cantGoles', jugador.cantGoles) || jugador.cantGoles;
          const cantAmarillas = _.get(req, 'body.cantAmarillas', jugador.cantAmarillas) || jugador.cantAmarillas;
          const cant2min = _.get(req, 'body.cant2min', jugador.cant2min) || jugador.cant2min;
          const cantRojas = _.get(req, 'body.cantRojas', jugador.cantRojas) || jugador.cantRojas;

          jugador.nombre = nombre;
          jugador.apellido = apellido;
          jugador.peso = peso;
          jugador.altura = altura;
          jugador.edad = edad;
          jugador.cantGoles = cantGoles;
          jugador.cantAmarillas = cantAmarillas;
          jugador.cant2min = cant2min;
          jugador.cantRojas = cantRojas;

          jugador.save(function (err, jugador_db) {
            if (err || !jugador_db) {
              return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el jugador :(");
            } else {
              return sendRes(res, 200, jugador_db, "Success", null);
            }
          });
        }
      });
  });

// Borra un jugador de la bd
router.delete('/jugadores/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Jugador
      .findByIdAndRemove(req.params.id, (err, jugador) => {
        if (err || !jugador) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el jugador :(");
        } else {
          return sendRes(res, 200, jugador, "Success", null);
        }
      });
  });

module.exports = router;
