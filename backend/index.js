var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

//Inicializo las rutas
app.use('/api',require('./routes/api/apiPartidos'));
app.use('/api',require('./routes/api/apiEquipos'));

//process.env.port es usado por el servidor donde se publique la aplicacion
//oara proveer el puerto donde escuchara, si no lo tiene especificado escuchara
//en el puerto 3000
app.listen(process.env.port || 3000,function(){
  console.log('Escuchando puerto 3000');
})
