var express = require('express');
var app = express();

app.get('/',(req,res)=>{
  res.send('Hola Mundo');
})

//process.env.port es usado por el servidor donde se publique la aplicacion
//oara proveer el puerto donde escuchara, si no lo tiene especificado escuchara
//en el puerto 3000
app.listen(process.env.port || 3000,function(){
  console.log('Escuchando puerto 3000');
})
