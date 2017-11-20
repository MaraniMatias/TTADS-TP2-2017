import state from './index'

export default {
  set_equipos: (state, equipos) => {
    state.equipos = equipos;
  },

  update_equipos: (state, equipo) => {
    state.equipos.push(equipo);
  },

  delete_equipo: (state, equipo) => {
    for(var i = 0; i< state.equipos.length; i++){
      if(state.equipos[i]._id === equipo._id){
        state.equipos.splice(i,1);
        break;
      }
    }
  }
};
