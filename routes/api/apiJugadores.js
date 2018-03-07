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
    const jugador = _.get(req, 'query.jugador', false) || false;
    let query = {}
    if (jugador) {
      query.$or = [
        { nombre: { $regex: jugador, $options: 'i' } },
        { apellido: { $regex: jugador, $options: 'i' } }
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
    const nombre = _.get(req, 'body.jugador.nombre', false) || false;
    const apellido = _.get(req, 'body.jugador.apellido', false) || false;
    if (nombre && apellido) {
      const peso = _.get(req, 'body.jugador.peso');
      const altura = _.get(req, 'body.jugador.altura');
      const edad = _.get(req, 'body.jugador.edad');
      const cantGoles = _.get(req, 'body.jugador.cantGoles');
      const cantAmarillas = _.get(req, 'body.jugador.cantAmarillas');
      const cant2min = _.get(req, 'body.jugador.cant2min');
      const cantRojas = _.get(req, 'body.jugador.cantRojas');
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
    const nombre = _.get(req, 'body.jugador.nombre', false) || false;
    const apellido = _.get(req, 'body.jugador.apellido', false) || false;
    if (nombre && apellido) {
      const peso = _.get(req, 'body.jugador.peso', false) || false;
      const altura = _.get(req, 'body.jugador.altura', false) || false;
      const edad = _.get(req, 'body.jugador.edad', false) || false;
      const cantGoles = _.get(req, 'body.jugador.cantGoles', false) || false;
      const cantAmarillas = _.get(req, 'body.jugador.cantAmarillas', false) || false;
      const cant2min = _.get(req, 'body.jugador.cant2min', false) || false;
      const cantRojas = _.get(req, 'body.jugador.cantRojas', false) || false;
      Jugador
        .findById(req.params.id)
        .exec(function (err, jugador) {
          if (err || !jugador) {
            return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar al jugador :(");
          } else {
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
                return sendRes(res, 200, jugador, "Success", null);
              }
            });
          }
        });
    }else{
      return sendRes(res, 402, null, "Parameros requeridos: nombre, apellido", null);
    }

  });

// Borra un jugador de la bd
router.delete('/jugadores/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Jugador
      .deleteOne(req.params.id, (err, jugador_db) => {
        if (err || !jugador_db) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos borrar al jugador :(");
        } else {
          return sendRes(res, 200, jugador_db, "Success", null);
        }
      });
  });

module.exports = router;
