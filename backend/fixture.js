const mongoose = require('mongoose');
const Equipo = require('./models/equipo');
const TipoEvento = require('./models/tipoEvento');
const Partido = require('./models/partido');
const MiembroCuerpoTecnico = require('./models/miembroCuerpoTecnico');
const Jugador = require('./models/jugador');
const Marcador = require('./models/marcador');
const Torneo = require('./models/torneo')

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
      nombre: "jugador " + getRandomInt(100),
      apellido: "A " + getRandomInt(100),
    });

    var jugadorB = new Jugador({
      nombre: "jugador " + getRandomInt(100),
      apellido: "B " + getRandomInt(100),
    });

    var tecnico = new MiembroCuerpoTecnico({
      nombre: "tecnico " + getRandomInt(100),
      apellido: "A " + getRandomInt(100),
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

          var equipo1 = new Equipo({
            nombre: "equipo1 teting " + getRandomInt(10),
            jugadores: jugadores,
            goles: getRandomInt(10),
            cuerpoTecnico: cuerpoTecnico
          });

          var equipo2 = new Equipo({
            nombre: "equipo2 teting " + getRandomInt(10),
            jugadores: jugadores,
            goles: getRandomInt(10),
            cuerpoTecnico: cuerpoTecnico
          });

          equipo1.save(function (err, equipo1_db) {
            if (err || !equipo1_db) { return new Error("Error"); }
            Equipo.find({})
              .populate('jugadores')
              .populate('cuerpoTecnico')
              .exec(function (err, equipos) {
                if (err || !equipos) {
                  return new Error("Error");
                } else {
                  let marcador = new Marcador({
                    golesEquipoA: getRandomInt(10),
                    golesEquipoB: getRandomInt(10)
                  });

                  marcador.save(function (err, marcador_db) {
                    if (err || !marcador_db) {
                      return new Error("Error");
                    } else {
                      var partido1 = new Partido({
                        equipos: equipos,
                        estado: "Programado",
                        marcador: marcador,
                        eventos: [],
                        fechaInicio: new Date(),
                        msDescanso: null,
                        estadio: "Malvinas Argentinas",
                        categoria: "Adultos",
                        arbitros: [],
                        destacado: true
                      });

                      var partido2 = new Partido({
                        equipos: equipos,
                        estado: "Programado",
                        marcador: marcador,
                        eventos: [],
                        fechaInicio: new Date(),
                        msDescanso: null,
                        estadio: "Malvinas Argentinas",
                        categoria: "Adultos",
                        arbitros: [],
                        destacado: true
                      });

                      partido1.save(function (err, partido1_db) {
                        if (err || !partido1_db) {
                          return new Error("Error");
                        } else {
                          partido2.save(function (err, partido2_db) {
                            if (err || !partido2_db) {
                              return new Error("Error");
                            } else {

                              var partidos = []
                              partidos.push(partido1);
                              partidos.push(partido2);

                              var torneo = new Torneo({
                                nombre: "Torneo " + getRandomInt(10),
                                equipos: equipos,
                                partidos: partidos,
                                fechaInicio: new Date(),
                                fechaFin: new Date(new Date().getTime() + 1236434)
                              });

                              torneo.save(function (err, torneo_db) {
                                if (err || !torneo_db) { return new Error("Error"); }
                                Torneo.find({})
                                  .populate('equipos')
                                  .populate('partidos')
                                  .exec(function (err, res) {
                                    if (err || !res) {
                                      return new Error("Error");
                                    } else {
                                      console.log("DB poblada :D");
                                      mongoose.connection.close();
                                    }
                                  });
                              })
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
          });
        });
      });
    });
  }
});
