const SECRET_KEY_SESSION = 'my key secret';
const pkg = require('./package');
const express = require('express'),
  app = express(),
  morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParse = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const fixture = require('./fixture');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const os = require('os');
const ifaces = os.networkInterfaces();

// Models
const Users = require('./models/usuario');

Object.assign = require('object-assign');

// app.use(morgan('combined'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Las variables de entorno deben configurarse
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
}, function (username, password, done) {
  //TODO: Usar metodo para valiar :D
  Users
    .findOne({
      username,
      password
    })
    .select('-password') // Seleciona todos los campos menos password
    .exec(function (err, admin) {
      if (err) { return done(err); }
      if (!admin) { return done(null, false); }
      return done(null, admin);
    });
}));

passport.serializeUser(function (user, cb) {
  // console.log('serializeUser', user);
  cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
  // console.log('deserializeUser', id);
  Users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

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
app.use(session({
  secret: SECRET_KEY_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Middleware. Esta funcion me permite hacer peticiones http de localhost a localhost
// TODO: Probar el if
// if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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

// Static, FronEnd
// NOTE: Por ahora no tocar, la uso en el serve
app.use('/status', function (req, res) {
  res.json({
    // Variable del sel servidor
    server: process.env.OPENSHIFT_BUILD_NAME ? 'Server runing :D' : 'localhost',
    version: `v${pkg.version}`
  });
});
app.use('/cliente', express.static('./public/cliente'));
app.use('/admin', express.static('./public/gestor'));

// Poblar la db, util en el servidor, no pude usar fixture :(
app.use('/load-db', function (req, res) {
  fixture.load(function () {
    res.end('DB poblada');
  });
});

// Define routes.
// /login username password
// curl 'http://192.168.1.6:3000/login' -H 'content-type: application/json' --data '{"username":"admin","password":"123456"}'
app.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    console.log(req.user);
    res.end('ok');
  });
app.get('/logout',
  function (req, res) {
    req.logout();
    res.end('Logut');
  });
app.get('/faild',
  passport.authenticate('local'),
  function (req, res) {
    res.end('Faild :(');
  });
app.get('/me',
  function (req, res) {
    console.log(req.user);
    res.json(req.user);
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
