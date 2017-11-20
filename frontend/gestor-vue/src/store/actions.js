import axios from 'axios';
const baseURL = "http://localhost:3000/api";

export default {
  getEquipos: function({ commit, state }){
    axios.get(baseURL+"/equipos")
        .then((response) => {
          commit('set_equipos', response.data);
        }, (err) => {
          console.error(err);
        });
  },
  setEquipo: function ({ commit, state }, obj) {
    axios.post(baseURL + "/equipos/", obj)
      .then((response) => {
        commit('update_equipos',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  deleteEquipo: function({ commit, state }, equipo){
    axios.delete(baseURL+ "/equipos/"+equipo._id)
    .then((response) => {
      commit('delete_equipo',response.data);
      return response.data;
    }, (err) => {
      console.error(err);
    });
  }
};
