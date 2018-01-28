var mongoose = require('mongoose');
var Equipo = require('./models/equipo');
var TipoEvento = require('./models/tipoEvento');
var Partido = require('./models/partido');
var MiembroCuerpoTecnico = require('./models/miembroCuerpoTecnico');
var Jugador = require('./models/jugador');

mongoose.Promise = global.Promise;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

mongoose.connect('mongodb://localhost/handballdb', { useMongoClient: true }, function (err, res) {
  if (err) {
    return console.error("Error al conectar a la base de datos: " + err);
  } else {
    console.log("Conexón a la base de datos establecida correctamente.");

    var jugadorA = new Jugador({
      nombre: "jugador " + getRandomInt(10),
      apellido: "A " + getRandomInt(10),
    });
    var jugadorB = new Jugador({
      nombre: "jugador " + getRandomInt(10),
      apellido: "B " + getRandomInt(10),
    });

    var tecnico = new MiembroCuerpoTecnico({
      nombre: "tecnico " + getRandomInt(10),
      apellido: "A " + getRandomInt(10),
    });

    jugadorA.save(function (err, jugadorA_db) {
      if (err || !jugadorA_db) { return new Error("Error"); }
      jugadorB.save(function (err, jugadorB_db) {
        if (err || !jugadorB_db) { return new Error("Error"); }
        tecnico.save(function (err, tecnico_db) {
          if (err || !tecnico_db) { return new Error("Error"); }
          var jugadores = [];
          jugadores.push(jugadorA_db);
          jugadores.push(jugadorB_db);
          var cuerpoTecnico = [];
          cuerpoTecnico.push(tecnico_db);
          var equipo = new Equipo({
            nombre: "equipo teting " + getRandomInt(10),
            jugadores: jugadores,
            goles: getRandomInt(10),
            cuerpoTecnico: cuerpoTecnico
          });
          equipo.save(function (err, equipo_db) {
            if (err || !equipo_db) { return new Error("Error"); }
            Equipo.find({})
              .populate('jugadores')
              .populate('cuerpoTecnico')
              .exec(function (err, equipos) {
                if (err || !equipos) {
                  return new Error("Error");
                } else {
                  console.log(equipos);
                  mongoose.connection.close();
                }
              });
          });
        });
      });
    });
  }
});
