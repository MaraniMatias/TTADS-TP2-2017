import state from './index'

export default {
  set_store: (state, equipos) => {
    state.equipos = equipos;
  },

  add_to_store: (state, equipo) => {
    state.equipos.push(equipo);
  },

  update_store: (state, equipo) => {
    for(var i = 0; i< state.equipos.length; i++){
      if(state.equipos[i]._id === equipo._id){
        state.equipos[i].nombre = equipo.nombre;
        state.equipos[i].escudoURL = equipo.escudoURL;
        break;
      }
    }
  },

  delete_from_store: (state, equipo) => {
    for(var i = 0; i< state.equipos.length; i++){
      if(state.equipos[i]._id === equipo._id){
        state.equipos.splice(i,1);
        break;
      }
    }
  }
};
