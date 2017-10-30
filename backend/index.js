var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

//Creo la conexion con MongoDB. Si no existe, la crea.
mongoose.connect('mongodb://localhost/handballdb');
mongoose.Promise = global.Promise; //TODO:Ver esto

//Middleware
app.use(bodyParser.json());

//Inicializo las rutas
app.use('/api',require('./routes/api/apiPartidos'));
app.use('/api',require('./routes/api/apiEquipos'));
app.use('/api',require('./routes/api/apiTiposEvento'));

//Middleware
app.use(function(err,req,res,next){
  res.status(422).send({error: err.message})
})

//process.env.port es usado por el servidor donde se publique la aplicacion
//oara proveer el puerto donde escuchara, si no lo tiene especificado escuchara
//en el puerto 3000
app.listen(process.env.port || 3000,function(){
  console.log('Escuchando puerto 3000');
})
