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
};
