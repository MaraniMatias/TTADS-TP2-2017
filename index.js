var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
const os = require('os');
const ifaces = os.networkInterfaces();

var app = express();

// process.env.port es usado por el servidor donde se publique la aplicacion
// para proveer el puerto donde escuchara, si no lo tiene especificado escuchara
// en el puerto 3000
const port = process.env.PORT || process.env.NODEJS_MONGO_PERSISTENT_SERVICE_PORT || 3000,
  ip = process.env.IP || process.env.NODEJS_MONGO_PERSISTENT_SERVICE_HOST || "0.0.0.0";
var mongoURLLabel = 'mongodb://localhost/handballdb';

// Error
process.on('uncaughtException', function (err) {
  console.log("Exception", err.stack);
});

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  // Creo la conexion para MongoDB corriendo en el servidor
  // mongoURLLabel = `mongodb://dXNlck5UQQ==:WFc2eWpIa01ZNmkzNDM1Tg==@${process.env.MONGODB_SERVICE_HOST}:${process.env.MONGODB_SERVICE_PORT}/handballdb`;
  mongoURLLabel = `mongodb://matias:M4t7iAs18@${process.env.MONGODB_SERVICE_HOST}:${process.env.MONGODB_SERVICE_PORT}/handballdb`;
  // console.log(process.env);
}

mongoose.Promise = global.Promise;

// Permito el acceso a los recursos del servidor desde otros dominios
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Middleware. Esta funcion me permite hacer peticiones http de localhost a localhost
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Inicializo las rutas
app.use('/api', require('./routes/api/apiMiembrosCuerpoTecnico'));
app.use('/api', require('./routes/api/apiJugadores'));
app.use('/api', require('./routes/api/apiPartidos'));
app.use('/api', require('./routes/api/apiEquipos'));
app.use('/api', require('./routes/api/apiTiposEvento'));
app.use('/api', require('./routes/api/apiTorneos'));
app.use('/api', require('./routes/api/apiFixture'));

// Static, FronEnd
app.use('/', function (req, res) {
  res.end('Server runing :D');
});
app.use('/cliente', express.static('public/cliente'));
app.use('/admin', express.static('public/gestor'));

// Middleware
app.use(function (err, req, res, next) {
  res.status().send({ error: err.message })
})

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
    app.listen(port, ip, function () {
      getLocalIP();
      console.log('Server running on http://%s:%s', ip, port);
    });
  }
});

module.exports = app;
