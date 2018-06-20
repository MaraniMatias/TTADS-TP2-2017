# TTADS-TP2-2017
![https://circleci.com/gh/MaraniMatias/TTADS-TP2-2017.svg?style=svg](https://circleci.com/gh/MaraniMatias/TTADS-TP2-2017.svg?style=svg)
## Integrantes
``` javascript
var tp = {
  anio: 2017,
  integrantes : [{
    nombre : "Andrés de la Grana",
    legajo : 41034
  }, {
    nombre : "Marani Matias Ezequiel",
    legajo : 39710
  }]
}
console.log(tp.integrantes);
```

## Alcance del TP

Este proyecto consiste de un Backend que será consumido por la aplicación móvil correspondiente al
repositorio https://github.com/MaraniMatias/TTADS-TP3-2017.

El Backend antes mencionado consta de las siguientes funciones:

- ABMC de torneos
- ABMC de partidos
- ABMC de equipos
- ABMC de jugadores
- ABMC de tipos de evento
- La api de cada uno de los nombrados anteriormente puede usarse para:
  - Consultar todos los objetos
  - Consultar un conjunto de objetos que cumplan con el(los) parémetro(s) especificado(s)
  - Consultar un solo objeto junto con su detalle
  - Dar de alta un objeto
  - Modificar un determinado objeto pasando el id por una petición GET
  - Eliminar un determinado objeto pasando el id por una petición GET
  Mas abajo en este readme tenemos un ejemplo de uso.
- Todas las consultas que recuperen información y traigan varios objetos, incorporan un paginado. Esto se
  logra con un interceptor que asigna valores de skip y limit a la consulta. Si no vienen espeficicados estos
  valores en la petición GET, se les dará valores por default. El interceptor antes mencionado es el siguiente:

  ``` javascript

  queryPage = function (req, res, next) {
    // En caso de no estar definido se fuerza a 0
    const skip = _.get(req, 'query.skip', 0) || 0;
    // En caso de no estar definido se fuerza a 15
    let limit = _.get(req, 'query.limit', 15) || 15;
    limit = parseInt(limit, 10);
    req.query.skip = parseInt(skip, 10);
    req.query.limit = limit > 0 ? limit : 15;
    // Continuar con la consulta a la API
    next();
  };

  ```
- Se incorpora una función de normalización para todas las respuestas del servidor.
  - Esta función es la siguiente:

      ```javascript
      sendRes = function (res, cod, data, message, error) {
        res.status(cod);
        return res.json({ data, message, error });
      };
      ```

    La misma recibe la respuesta del servidor, el código de la respuesta, los objetos afectados, un mensaje
    que describe la situación y entendible por el usuario y un error si lo hubiera.

- Seguridad para todas las peticiones POST, PUT y DELETE antes mencionados incorporando autentificación
  por token.

## Ejemplo

### Modelo de equipo

```javascript

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del equipo es requerido']
  },
  escudoURL: {
    type: String,
    default: 'https://api.adorable.io/avatars/128/default.png'
  },
  jugadores: [{
    type: Schema.Types.ObjectId,
    ref: 'Jugadores'
  }],
  goles: {
    type: Number,
    default: 0
  },
  cuerpoTecnico: [{
    type: Schema.Types.ObjectId,
    ref: 'MiembrosCuerpoTecnico'
  }]
});

EquipoSchema.pre("save", function (next) {
  if (typeof this.escudoURL === 'undefined' || this.escudoURL) {
    this.escudoURL = `https://api.adorable.io/avatars/128/${Math.floor(Math.random() * Math.floor(100))}.png`
  }
  next();
});

module.exports = mongoose.model('Equipos', EquipoSchema);

```

### API de equipo

```javascript
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const passport = require('passport');
const util = require('../utilities');
const queryPage = util.queryPage;
const sendRes = util.sendRes;
const Equipo = require('../../models/equipo');

// Recupera todos los equipos o solo aquellos que coincidan con el parámetro nombre
router.get('/equipos',
  queryPage, // interceptor para completar el paginado
  function (req, res) {
    // Validar parámetros de la consulta
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

// Recupera un equipo que coincida con el parámetro id
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

// Agrega un equipo a la base de datos
router.post('/equipos',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    // Recupero la información del body de la petición
    const nombre = _.get(req, 'body.equipo.nombre', false) || false;
    const escudoURL = _.get(req, 'body.equipo.escudoURL', null);
    const jugadores = _.get(req, 'body.equipo.jugadores', false) || false;
    const cuerpoTecnico = _.get(req, 'body.equipo.cuerpoTecnico', false) || false;

    // Valido que estos 3 campos de la petición se encuentren definidos
    if (nombre && jugadores && cuerpoTecnico) {
      const equipo = new Equipo({
        nombre: nombre,
        escudoURL: escudoURL,
        jugadores: jugadores,
        cuerpoTecnico: cuerpoTecnico
      });

      // Guardo el equipo en la base de datos
      equipo.save((error, equipo_db) => {
        if (error || !equipo_db) {
          // Utilización de la función de normalización antes mencionada
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
    // Busco un equipo en la base de datos
    Equipo
      .findById(req.params.id)
      .exec(function (err, equipo) {

        // Si se encontró el equipo recupero la información del body de la petición y le asigno los datos
        if (err || !equipo) {
          return sendRes(res, 500, null, 'Error', err || "No pudimos encontrar el equipo :(");
        } else {
          const nombre = _.get(req, 'body.equipo.nombre', equipo.nombre) || equipo.nombre;
          const escudoURL = _.get(req, 'body.equipo.escudoURL', equipo.escudoURL) || equipo.escudoURL;
          const jugadores = _.get(req, 'body.equipo.jugadores', equipo.jugadores) || equipo.jugadores;
          const cuerpoTecnico = _.get(req, 'body.equipo.cuerpoTecnico', equipo.cuerpoTecnico) || equipo.cuerpoTecnico;
          equipo.nombre = nombre;
          equipo.escudoURL = escudoURL;
          equipo.jugadores = jugadores;
          equipo.cuerpoTecnico = cuerpoTecnico;

          // Guardo el equipo en la base de datos
          equipo.save(function (err, equipo_db) {
            if (err || !equipo_db) {
              return sendRes(res, 500, null, 'Error', err || "No pudimos actualizar el equipo :(");
            } else {
              return sendRes(res, 200, equipo_db, "Success", null);
            }
          });
        }
      });
  });

// Borra un equipo de la bd
router.delete('/equipos/:id',
  // Para validar la autenticación con el token
  passport.authenticate('jwt', { session: false }),
  function (req, res) {

    // Borro un equipo que coincida con el parámetro id
    Equipo.deleteOne(req.params.id, function (err, equipo_db) {
      if (err || !equipo_db) {
        return sendRes(res, 500, null, 'Error', err || "No pudimos borrar el equipo :(");
      } else {
        return sendRes(res, 200, equipo_db, "Success", null);
      }
    });
  });

```

## Tecnologías y dependencias utilizadas


- [body-parser](https://github.com/expressjs/body-parser): Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
- [chai](https://github.com/chaijs/chai): Chai is an assertion library, similar to Node's build in assert. It makes testing much easier by giving you lots of assertions you can run against your code.
- [express](https://github.com/expressjs/express): Web framework for node.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken): JSON Web token implementation.
- [lodash](https://github.com/lodash/lodash): Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.
- [mocha](https://github.com/mochajs/mocha): Simple, flexible, fun JavaScript test framework for Node.js & The Browser
- [mongoDB](http://mongodb.com): Free and open-source cross-platform document-oriented database program.
- [mongoose](https://github.com/Automattic/mongoose): Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
- [morgan](https://github.com/expressjs/morgan): HTTP request logger middleware for node.js
- [nodejs](http://nodejs.org): Open-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side.
- [passport](https://github.com/jaredhanson/passport):Passport is Express-compatible authentication middleware for Node.js.
- [passport-jwt](https://github.com/themikenicholson/passport-jwt): This module lets you authenticate endpoints using a JSON web token.
- [passport-local](https://github.com/jaredhanson/passport-local): This module lets you authenticate using a username and password in your Node.js applications.

## Servidor online

El proyecto se encuentra corriendo de forma online. La url es la siguiente:

http://nodejs-mongo-persistent-ttads-tp3-2017.a3c1.starter-us-west-1.openshiftapps.com/status

### Notas

Agregar variables de entorno las que se leen en `process.env.`.
Y configurar para que openshift valide que el server esta andando con `/status` y no con `/pagecount`
