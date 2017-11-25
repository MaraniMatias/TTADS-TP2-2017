import axios from 'axios';
const baseURL = "http://localhost:3000/api";

export default {
  getEquipos: function({ commit, state }){
    axios.get(baseURL+"/equipos")
        .then((response) => {
          commit('set_store', response.data);
        }, (err) => {
          console.error(err);
        });
  },
  setEquipo: function ({ commit, state }, obj) {
    axios.post(baseURL + "/equipos/", obj)
      .then((response) => {
        commit('add_to_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  deleteEquipo: function({ commit, state }, equipo){
    axios.delete(baseURL+ "/equipos/"+equipo._id)
    .then((response) => {
      commit('delete_from_store',response.data);
      return response.data;
    }, (err) => {
      console.error(err);
    });
  },
  updateEquipo: function ({ commit, state }, obj) {
    axios.put(baseURL + "/equipos/"+obj.id, obj)
      .then((response) => {
        commit('update_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
};
