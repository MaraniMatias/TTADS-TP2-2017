const SECRET_KEY_SESSION = process.SECRET_KEY_SESSION || 'mYk3y5eC7e1';
const pkg = require('./package');
const path = require('path');

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParse = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const session = require('express-session');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const os = require('os');
const ifaces = os.networkInterfaces();

// Models
const Users = require('./models/usuario');

const fixture = require('./fixture');

Object.assign = require('object-assign');

// Lista las pediciones al servidor en consola
// app.use(morgan('combined'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Las variables de entorno deben configurarse, en el servidor
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongodbUser = process.env.MONGODB_USER || process.env.MONGO_USER || '',
  mongoPass = process.env.MONGODB_PASSWORD || process.env.MONGO_PASS || '',
  mongodbName = process.env.MONGODB_DATABASE || 'handballdb';
var mongoURLLabel = 'mongodb://localhost/' + mongodbName;

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  // Creo la conexion para MongoDB corriendo en el servidor
  mongoURLLabel = `mongodb://${mongodbUser}:${mongoPass}@${process.env.MONGODB_SERVICE_HOST}:${process.env.MONGODB_SERVICE_PORT}/${mongodbName}`;
  // console.log(process.env);
}

// Config passport
passport.use(new LocalStrategy({
  // usernameField: 'email',
  // passwordField: 'passwd'
}, function (username, password, next) {
  // console.log(username, password);
  Users
    .findOne({ username: username })
    // .select('-password') // Seleciona todos los campos menos password
    .exec(function (err, admin) {
      if (err || !admin) {
        return next(err, false);
      }
      if (admin.authenticate(password)) {
        return next(null, admin);
      } else {
        return next(null, false);
      }
    });
}));

passport.use(new JwtStrategy({
  // Creates a new extractor that looks for the JWT in the authorization header with the scheme 'bearer'
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY_SESSION
}, function (jwt_payload, next) {
  // console.log('payload received', jwt_payload);
  // usually this would be a database call:
  Users
    .findById(jwt_payload.id)
    .select('-password') // Seleciona todos los campos menos password
    .exec(function (err, admin) {
      if (err || !admin) {
        return next(err, false);
      }
      return next(null, admin);
    });

}));

passport.serializeUser(function (user, cb) {
  console.log('serializeUser', user.nombre);
  cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
  console.log('deserializeUser', id);
  Users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
// # Using Passport
// ## Login
// $ curl 'http://192.168.1.6:3000/auth/login' -H 'Host: 192.168.1.6:3000' -H 'content-type: application/json' --data '{"username":"admin","password":"123456"}'
// ## Autentificacion
// $ curl -H "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhOWNiOThkMGRmMjdhNWEyNjBkMDUwMiIsImlhdCI6MTUyMDI1NzEwMX0.dIEVI-LJy4la9e1sJh--PTBAo2A7nQrXAtBn-Xpg5mc" 'http://192.168.1.6:3000/auth/me'

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

// Error
process.on('uncaughtException', function (err) {
  console.log("Exception", err.stack);
});

mongoose.Promise = global.Promise;

// Permito el acceso a los recursos del servidor desde otros dominios
app.use(cors());

app.use(cookieParse());
// Parsear el cueropo de dato en POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// TODO: creo que no se utiliza
app.use(session({
  secret: SECRET_KEY_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    // maxAge: 3600000
  }
}));

// Middleware. Esta funcion me permite hacer peticiones http de localhost a localhost
// TODO: Probar el if
// if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
app.all('/*', function (req, res, next) {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
//}

// Inicializo las rutas
app.use('/api', require('./routes/api/apiMiembrosCuerpoTecnico'));
app.use('/api', require('./routes/api/apiJugadores'));
app.use('/api', require('./routes/api/apiPartidos'));
app.use('/api', require('./routes/api/apiEquipos'));
app.use('/api', require('./routes/api/apiTiposEvento'));
app.use('/api', require('./routes/api/apiTorneos'));
app.use('/api', require('./routes/api/apiFixture'));

app.use('/auth', require('./routes/auth'));

// Static, FronEnd
app.use(express.static(path.join(__dirname, 'public')));
// NOTE: Por ahora no tocar, la uso en el serve
app.use('/status', function (req, res) {
  res.json({
    // Variable del sel servidor
    server: process.env.OPENSHIFT_BUILD_NAME ? 'OPENSHIFT' : 'localhost',
    version: `v${pkg.version}`
  });
});
// app.use('/cliente', express.static('./public/cliente'));
// app.use('/admin', express.static('./public/gestor'));

// Poblar la db, util en el servidor, no pude usar fixture :(
app.use('/load-db', function (req, res) {
  fixture.load(function () {
    res.end('DB poblada');
  });
});

// Listar las IP de las interfaces de red.
function getLocalIP() {
  for (key in ifaces) {
    console.log(`IP ${key}: ${ifaces[key][0].address}`);
  }
}

mongoose.connect(mongoURLLabel, function (err, res) {
  if (err) {
    return console.error("Error al conectar a la base de datos: " + err);
  } else {
    console.log("Conexón a la base de datos establecida correctamente.");
    app.listen(port, ip, () => {
      getLocalIP();
      console.log('Server running on http://%s:%s', ip, port);
    });
  }
});

module.exports = app;
