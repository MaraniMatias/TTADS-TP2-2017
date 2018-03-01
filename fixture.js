// TODO Usar Bluebirdjs
const mongoose = require('mongoose');
const Equipo = require('./models/equipo');
const TipoEvento = require('./models/tipoEvento');
const Partido = require('./models/partido');
const MiembroCuerpoTecnico = require('./models/miembroCuerpoTecnico');
const Jugador = require('./models/jugador');
const Marcador = require('./models/marcador');
const Torneo = require('./models/torneo')

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL
  mongoURLLabel = 'mongodb://localhost/handballdb';
console.log(port, ip, mongoURL, process.env);

mongoose.Promise = global.Promise;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


mongoose.connect(mongoURLLabel, function (err, res) {
  if (err) {
    return console.error("Error al conectar a la base de datos: " + err);
  }
  console.log("Conexón a la base de datos establecida correctamente.");

  const jugadorA = new Jugador({
    nombre: "jugador " + getRandomInt(100),
    apellido: "A " + getRandomInt(100),
  });

  const jugadorB = new Jugador({
    nombre: "jugador " + getRandomInt(100),
    apellido: "B " + getRandomInt(100),
  });

  const tecnico = new MiembroCuerpoTecnico({
    nombre: "tecnico " + getRandomInt(100),
    apellido: "A " + getRandomInt(100),
  });

  jugadorA.save(function (err, jugadorA_db) {
    if (err || !jugadorA_db) { return console.error(err); }
    console.log("Guardar jugador A");
    jugadorB.save(function (err, jugadorB_db) {
      if (err || !jugadorB_db) { return console.error(err); }
      console.log("Guardar jugador B");
      tecnico.save(function (err, tecnico_db) {
        if (err || !tecnico_db) { return console.error(err); }
        console.log("Guardar tecnico");
        let jugadores = [];
        jugadores.push(jugadorA_db);
        jugadores.push(jugadorB_db);
        let cuerpoTecnico = [];
        cuerpoTecnico.push(tecnico_db);

        const equipo1 = new Equipo({
          nombre: "equipo1 teting " + getRandomInt(10),
          jugadores: jugadores,
          goles: getRandomInt(10),
          cuerpoTecnico: cuerpoTecnico
        });

        const equipo2 = new Equipo({
          nombre: "equipo2 teting " + getRandomInt(10),
          jugadores: jugadores,
          goles: getRandomInt(10),
          cuerpoTecnico: cuerpoTecnico
        });

        equipo1.save(function (err, equipo1_db) {
          if (err || !equipo1_db) { return console.error(err); }
          console.log("Guardar equipo 1");
          equipo2.save(function (err, equipo2_db) {
            if (err || !equipo2_db) { return console.error(err); }
            console.log("Guardar equipo 2");
            const marcador = new Marcador({
              golesEquipoA: getRandomInt(10),
              golesEquipoB: getRandomInt(10)
            });

            marcador.save(function (err, marcador_db) {
              if (err || !marcador_db) { return console.error(err); }
              console.log("Guardar marcador");
              const eventoGool = new TipoEvento({
                nombre: "Gool :D",
              });
              const eventoTiroLibre = new TipoEvento({
                nombre: "Tiro libre",
              });

              eventoGool.save((err, eventoGool_db) => {
                if (err || !eventoGool_db) { return console.error(err); }
                console.log("Guardar eventoGool");
                eventoTiroLibre.save((err, eventoTiroLibre_db) => {
                  if (err || !eventoTiroLibre_db) { return console.error(err); }
                  console.log("Guardar eventoTiroLibre");

                  const partido1 = new Partido({
                    equipoB: equipo1_db,
                    equipoA: equipo2_db,
                    estado: "Iniciado",
                    marcador: marcador_db,
                    eventos: [{
                      evento: eventoGool_db,
                      descripcion: 'Gool gracias a ' + jugadorB_db.nombre,
                      fecha: new Date(new Date().getTime() + 3000422)
                    }, {
                      evento: eventoTiroLibre_db,
                      descripcion: 'Tiro libre :D a vavor de ' + equipo2_db.nombre,
                      fecha: new Date(new Date().getTime() + 3000231422)
                    }],
                    fechaInicio: new Date(),
                    msDescanso: 123,
                    estadio: "Malvinas Argentinas",
                    categoria: "Adultos",
                    arbitros: [],
                    destacado: true
                  });

                  const partido2 = new Partido({
                    equipoA: equipo1_db,
                    equipoB: equipo2_db,
                    estado: "Programado",
                    marcador: marcador_db,
                    eventos: [{
                      evento: eventoGool_db,
                      descripcion: 'Gool gracias a ' + jugadorA_db.nombre,
                      fecha: new Date(new Date().getTime() + 3000422)
                    }],
                    fechaInicio: new Date('2-10-2030'),
                    msDescanso: 0,
                    estadio: "Malvinas Argentinas",
                    categoria: "Adultos",
                    arbitros: [],
                    destacado: false
                  });

                  partido1.save((err, partido1_db) => {
                    if (err || !partido1_db) { return console.error(err); }
                    console.log("Guardar partido 1");
                    partido2.save((err, partido2_db) => {
                      console.log("Guardar partido 2");
                      if (err || !partido2_db) { return console.error(err); }

                      let partidos = [];
                      partidos.push(partido1_db);
                      partidos.push(partido2_db);

                      const torneo = new Torneo({
                        nombre: "Torneo " + getRandomInt(10),
                        partidos: partidos,
                        fechaInicio: new Date(),
                        fechaFin: new Date(new Date().getTime() + 1236434)
                      });

                      torneo.save((err, torneo_db) => {
                        if (err || !torneo_db) { return console.error(err); }
                        console.log("Guardar torneo");
                        partido1_db.torneo = torneo_db;
                        partido1_db.save((err, partido1_tdb) => {
                          if (err || !partido1_tdb) { return console.error(err); }
                          console.log("Agregar torneo al partido 1");
                          partido2_db.torneo = torneo_db;
                          partido2_db.save((err, partido2_tdb) => {
                            if (err || !partido2_tdb) { return console.error(err); }
                            console.log("Agregar torneo al partido 2");

                            console.log("DB poblada :D");
                            mongoose.connection.close();
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
