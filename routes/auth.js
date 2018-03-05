"use strict";
const SECRET_KEY_SESSION = process.SECRET_KEY_SESSION || 'mYk3y5eC7e1';
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const util = require('./utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;

const User = require('../models/usuario.js');

// Define routes.
// /login username password
// curl 'http://192.168.1.6:3000/login' -H 'content-type: application/json' --data '{"username":"admin","password":"123456"}'
router.post('/login',
  // Para validar la autenticación contra la BD
  passport.authenticate('local'),
  function (req, res) {
    // console.log(req.user);
    let user = req.user;
    user.password = null; // Avoid sending password encryption
    let token = jwt.sign({ id: req.user._id }, SECRET_KEY_SESSION);
    let data = {
      user: user,
      token: token
    };
    // res, status, data, messager, error
    return sendRes(res, 200, data, "Success", null);
  });

router.get('/logout',
  function (req, res) {
    req.logout();
    return sendRes(res, 200, null, "Success", null);
  });

router.get('/me',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    // console.log(req.user);
    // res, status, data, messager, error
    return sendRes(res, 200, req.user, "Success", null);
  });

module.exports = router;
