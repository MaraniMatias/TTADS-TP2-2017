import state from './index'

export default {

  //Equipo
  set_equipo_store: (state, equipos) => {
    state.equipos = equipos;
  },

  add_equipo_to_store: (state, equipo) => {
    state.equipos.push(equipo);
  },

  update_equipo_store: (state, equipo) => {
    for(var i = 0; i< state.equipos.length; i++){
      if(state.equipos[i]._id === equipo._id){
        state.equipos[i].nombre = equipo.nombre;
        state.equipos[i].escudoURL = equipo.escudoURL;
        break;
      }
    }
  },

  delete_equipo_from_store: (state, equipo) => {
    for(var i = 0; i< state.equipos.length; i++){
      if(state.equipos[i]._id === equipo._id){
        state.equipos.splice(i,1);
        break;
      }
    }
  },

  //Partido
  set_partido_store: (state, partidos) => {
    state.partidos = partidos;
  },

  add_partido_to_store: (state, partido) => {
    state.partidos.push(partido);
  },

  update_partido_store: (state, partido) => {
    for(var i = 0; i< state.partidos.length; i++){
      if(state.partidos[i]._id === partido._id){
        state.partidos[i].equipos = partido.equipos;
        state.partidos[i].golesEquipo1 = partido.golesEquipo1;
        state.partidos[i].golesEquipo2 = partido.golesEquipo2;
        state.partidos[i].estado = partido.estado;
        state.partidos[i].eventos = partido.eventos;
        state.partidos[i].fechaInicio = partido.fechaInicio;
        state.partidos[i].estadio = partido.estadio;
        state.partidos[i].categoria = partido.categoria;
        state.partidos[i].arbitros = partido.arbitros;
        state.partidos[i].destacado = partido.destacado;
        break;
      }
    }
  },

  delete_partido_from_store: (state, partido) => {
    for(var i = 0; i< state.partidos.length; i++){
      if(state.partidos[i]._id === partido._id){
        state.partidos.splice(i,1);
        break;
      }
    }
  },


  //Tipos Evento
  set_tipo_evento_store: (state, tiposEvento) => {
    state.tiposEvento = tiposEvento;
  },

  add_tipo_evento_to_store: (state, tipoEvento) => {
    state.tiposEvento.push(tipoEvento);
  },

  update_tipo_evento_store: (state, tipoEvento) => {
    for(var i = 0; i< state.tiposEvento.length; i++){
      if(state.tiposEvento[i]._id === tipoEvento._id){
        state.tiposEvento[i].nombre = tipoEvento.nombre;
        break;
      }
    }
  },

  delete_tipo_evento_from_store: (state, tipoEvento) => {
    for(var i = 0; i< state.tiposEvento.length; i++){
      if(state.tiposEvento[i]._id === tipoEvento._id){
        state.tiposEvento.splice(i,1);
        break;
      }
    }
  },

  //torneos
  set_torneos_store: (state, torneos) => {
    state.torneos = torneos;
  },
  add_torneo_to_store: (state, torneo) => {
    state.torneos.push(torneo);
  },
  delete_torneo_from_store: (state, torneo) => {
    for(var i = 0; i< state.torneos.length; i++){
      if(state.torneos[i]._id === torneo._id){
        state.torneos.splice(i,1);
        break;
      }
    }
  },
  update_torneo_store: (state, torneo) => {

    for(var i = 0; i< state.torneos.length; i++){
      if(state.torneos[i]._id === torneo._id){
        state.torneos[i].nombre = torneo.nombre;
        state.torneos[i].fechaInicio = torneo.fechaInicio;
        state.torneos[i].fechaFin = torneo.fechaFin;
        break;
      }
    }
  },

};
