var mongoose = require('mongoose');
var Equipo = require('./models/equipo');
var TipoEvento = require('./models/tipoEvento');
var Partido = require('./models/partido');
var MiembroCuerpoTecnico = require('./models/miembroCuerpoTecnico');
var Jugador = require('./models/jugador');
var Marcador = require('./models/marcador');
var Torneo = require('./models/torneo')

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

          //console.log(equipo1);
          //console.log(equipo2);

          equipo1.save(function (err, equipo1_db) {
            if (err || !equipo1_db) { return new Error("Error"); }
            Equipo.find({})
              .populate('jugadores')
              .populate('cuerpoTecnico')
              .exec(function (err, equipos) {
                if (err || !equipos) {
                  return new Error("Error");
                } else {
                  //console.log(equipos);
                  //mongoose.connection.close();
                }
              });
          });

          equipo2.save(function (err, equipo2_db) {
            if (err || !equipo2_db) { return new Error("Error"); }
            Equipo.find({})
              .populate('jugadores')
              .populate('cuerpoTecnico')
              .exec(function (err, equipos) {
                if (err || !equipos) {
                  return new Error("Error");
                } else {
                  //console.log(equipos);
                  //mongoose.connection.close();
                }
              });

            var equipos = [];
            equipos.push(equipo1);
            equipos.push(equipo2);

            var marcador = new Marcador({
              equipos: equipos
            });

            //console.log(marcador);

            marcador.save(function(err, marcador_db){
              if (err || !marcador_db) { return new Error("Error"); }
              Marcador.find({})
                .populate('equipos')
                .exec(function (err, result) {
                  if (err || !result) {
                    return new Error("Error");
                  } else {
                    //mongoose.connection.close();
                  }
                });

                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();
                if(dd<10) {
                    dd = '0'+dd
                }
                if(mm<10) {
                    mm = '0'+mm
                }
                today = mm + '/' + dd + '/' + yyyy;

                var partido1 = new Partido({
                  equipos: equipos,
                  estado: "Programado",
                  marcador: marcador,
                  eventos: [],
                  fechaInicio: today,
                  msDescanso: null,
                  estadio:"Malvinas Argentinas",
                  categoria: "Adultos",
                  arbitros: [],
                  destacado: true
                });

                var partido2 = new Partido({
                  equipos: equipos,
                  estado: "Programado",
                  marcador: marcador,
                  eventos: [],
                  fechaInicio:  today,
                  msDescanso: null,
                  estadio:"Malvinas Argentinas",
                  categoria: "Adultos",
                  arbitros:[],
                  destacado: true
                });


                partido1.save(function(err, partido_db){
                  if (err || !partido_db) { return new Error("Error"); }
                  Partido.find({})
                    .populate('equipos')
                    .exec(function (err, equipos) {
                      if (err || !equipos) {
                        return new Error("Error");
                      } else {
                        //console.log(equipos);
                        //mongoose.connection.close();
                      }
                    });
                });

                partido2.save(function(err, partido_db){
                  if (err || !partido_db) { return new Error("Error"); }
                  Partido.find({})
                    .populate('equipos')
                    .exec(function (err, equipos) {
                      if (err || !equipos) {
                        return new Error("Error");
                      } else {
                        //console.log(equipos);
                        //mongoose.connection.close();
                      }
                    });

                    var partidos = []
                    partidos.push(partido1);
                    partidos.push(partido2);

                    var torneo = new Torneo({
                      nombre: "Torneo " + getRandomInt(10),
                      equipos: equipos,
                      partidos: partidos,
                      fechaInicio: today,
                      fechaFin: today
                    });

                    torneo.save(function(err,torneo_db){
                      if (err || !torneo_db) { return new Error("Error"); }
                      Torneo.find({})
                        .populate('equipos')
                        .populate('partidos')
                        .exec(function (err, res) {
                          if (err || !res) {
                            console.log(err);
                            return new Error("Error");
                          } else {
                            console.log(res);
                            mongoose.connection.close();
                          }
                        });
                    })
                });
            });
          });
        });
      });
    });
  }
});
