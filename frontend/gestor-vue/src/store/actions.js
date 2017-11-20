import axios from 'axios';
const baseURL = "http://localhost:3000/api";

export default {
  getEquipos: function({ commit, state }){
    axios.get(baseURL+"/equipos")
        .then((response) => {
          commit('set_tabla_equipos', response.data);
        }, (err) => {
          console.error(err);
        });
  },
  setEquipo: function ({ commit, state }, obj) {
    return axios.post(baseURL + "/equipos/", obj)
      .then((response) => {
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
};
