var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
const os = require('os');
const ifaces = os.networkInterfaces();

var app = express();
var port = process.env.port || 3000;

//Creo la conexion con MongoDB. Si no existe, la crea.

/*Mongoose's default connection logic is deprecated as of 4.11.0.
Please opt in to the new connection logic using the useMongoClient option,
but make sure you test your connections first if you're upgrading an existing codebase!

mongoose.connect('mongodb://localhost/handballdb', {
  useMongoClient: true
});*/
mongoose.Promise = global.Promise; //TODO:Ver esto  <-- Que se supone que es?

//Permito el acceso a los recursos del servidor desde otros dominios
app.use(cors());

//Middleware
app.use(bodyParser.json());

//Middleware. Esta funcion me permite hacer peticiones http de localhost a localhost
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
app.use('/', express.static('public/cliente'));
app.use('/admin', express.static('public/gestor'));

// Middleware
app.use(function (err, req, res, next) {
  res.status().send({ error: err.message })
})

//process.env.port es usado por el servidor donde se publique la aplicacion
//para proveer el puerto donde escuchara, si no lo tiene especificado escuchara
//en el puerto 3000

function getLocalIP() {
  for (key in ifaces) {
    console.log(`IP ${key}: ${ifaces[key][0].address}`);
  }
}

mongoose.connect('mongodb://localhost/handballdb', function (err, res) {
  if (err) {
    return console.error("Error al conectar a la base de datos: " + err);
  } else {
    console.log("Conexón a la base de datos establecida correctamente.");
    app.listen(port, function () {
      getLocalIP();
      console.log('Escuchando en el puerto: ' + port);
    });
  }
});