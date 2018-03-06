"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const TipoEvento = require('../../models/tipoEvento')

router.get('/tipos-evento',
queryPage, // interceptor para completar el paginado
function (req, res) {
  // Validar parámetro de la consulta
  const nombre = _.get(req, 'query.nombre', false) || false;
  let query = {}
  if (nombre) {
    query.nombre = { $regex: nombre, $options: 'i' };
  }
  TipoEvento
    .find(query)
    .select('nombre')
    .sort('nombre')
    .skip(req.query.skip)
    .limit(req.query.limit)
    .exec(function (err, tiposEvento) {
      if (err) {
        // res, status, data, messager, error
        return sendRes(res, 500, [], "Ha ocurrido un error", err);
      } else {
        // res, status, data, messager, error
        return sendRes(res, 200, tiposEvento || [], "Success", null);
      }
    });
});

// Agrega un tipo de evento a la bd
router.post('/tipos-evento',function(req,res,next){
  const nombre = _.get(req,'req.body.nombre',false) || false;
  if(nombre){
    const tipoEvento = new TipoEvento({
      nombre: req.body.nombre
    });
    tipoEvento.save((error,tipoevento_db)=>{
      if (err || !tipoevento_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos crear el tipo de evento :(");
      }else{
        return sendRes(res, 200, tipoevento_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "El parametro nombre es requerido", null);
  }
});

// Modifica un tipo de evento en la bd
router.put('/tipos-evento/:id',function(req,res){

  const id = _.get(req, 'params.id', false) || false;
  if(id){
    TipoEvento.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
      TipoEvento.findOne({_id: req.params.id},function(err,tipoevento_db){
        if (err || !tipoevento_db) {
          return sendRes(res, 500, null, 'Error', error || "No pudimos actualizar el tipo de evento :(");
        } else {
          return sendRes(res, 200, tipoevento_db, "Success", null);
        }
      })
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

//Borra un tipo de evento de la bd
router.delete('/tipos-evento/:id',function(req,res){
  const id = _.get(req, 'params.id', false) || false;
  if(id){
    TipoEvento.findByIdAndRemove({_id: req.params.id}, function(err, tipoEvento_db){
      if (err || !tipoevento_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el tipo de evento :(");
      } else {
        return sendRes(res, 200, tipoevento_db, "Success", null);
      }
    });
  }else{
    return sendRes(res, 402, null, "El parametro id es requerido", null);
  }
});

module.exports = router;
