const express = require('express');
const router = express.Router();
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const Torneo = require('../../models/torneo');

// Recupera todos los torneos
router.get('/torneos', function (req, res) {
  Torneo.find({})
    .select('nombre fechaInicio fechaFin')
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

router.get('/torneos/:id', function (req, res) {
  const id = _.get(req, 'params.id', false) || false;
  if(id){
    Toreno.findById(id)
      .populate('partidos')
      .then(function (torneo) {
        // res, status, data, messager, error
        return sendRes(res, 200, torneo || [], "Success", null);
      })
      .catch(function (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, null, "Ha ocurrido un error", err);
      });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

//Agrega un torneo a la bd
router.post('/torneos', function (req, res, next) {
  const nombre = _.get(req,'req.body.nombre',false) || false;
  const fechaInicio = _.get(req,'req.body.fechaInicio',false) || false;
  const fechaFin = _.get(req,'req.body.fechaFin',false) || false;
  if(nombre && fechaInicio && fechaFin){
    const torneo = new Torneo({
      nombre: nombre,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    });
    torneo.save((error,torneo_db)=>{
      if (error || !torneo_db) {
        return sendRes(res, 500, null, 'Error', error || "No pudimos crear el torneo :(");
      }else{
        return sendRes(res, 200, torneo_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "El parametro nombre es requerido", null);
  }
});

//Modifica un torneo en la bd
router.put('/torneos/:id', function (req, res) {

  const id = _.get(req, 'params.id', false) || false;
  if(id){
    Torneo.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
      Torneo.findOne({ _id: req.params.id })
      .populate('partidos')
      .exec(function (err, torneo) {
        if (err || !equipo_db) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el partido :(");
        } else {
          return sendRes(res, 200, equipo_db, "Success", null);
        }
      })
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

//Borra un torneo de la bd
router.delete('/torneos/:id', function (req, res) {
  const id = _.get(req, 'params.id', false) || false;
  if(id){
    Torneo.findByIdAndUpdate({ _id: req.params.id }, function(err, torneo_db){
      if (err || !torneo_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el partido :(");
      } else {
        return sendRes(res, 200, torneo_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

module.exports = router;
