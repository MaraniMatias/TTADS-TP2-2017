import axios from 'axios';
const baseURL = "http://localhost:3000/api";

// Equipos
export default {
  getEquipos: function({ commit, state }){
    axios.get(baseURL+"/equipos")
        .then((response) => {
          commit('set_equipo_store', response.data);
        }, (err) => {
          console.error(err);
        });
  },
  setEquipo: function ({ commit, state }, obj) {
    axios.post(baseURL + "/equipos/", obj)
      .then((response) => {
        commit('add_equipo_to_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  deleteEquipo: function({ commit, state }, equipo){
    axios.delete(baseURL+ "/equipos/"+equipo._id)
    .then((response) => {
      commit('delete_equipo_from_store',response.data);
      return response.data;
    }, (err) => {
      console.error(err);
    });
  },
  updateEquipo: function ({ commit, state }, obj) {
    axios.put(baseURL + "/equipos/"+obj.id, obj)
      .then((response) => {
        commit('update_equipo_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },

  //Partidos
  getPartidos: function({ commit, state }){
    axios.get(baseURL+"/partidos")
        .then((response) => {
          commit('set_partido_store', response.data);
        }, (err) => {
          console.error(err);
        });
  },
  setPartido: function ({ commit, state }, obj) {
    axios.post(baseURL + "/partidos/", obj)
      .then((response) => {
        commit('add_partido_to_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  updatePartido: function ({ commit, state }, obj) {
    axios.put(baseURL + "/partidos/"+obj.id, obj)
      .then((response) => {
        console.log("hola");
        commit('update_partido_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  deletePartido: function({ commit, state }, obj){
    axios.delete(baseURL+ "/partidos/"+obj._id)
    .then((response) => {
      commit('delete_partido_from_store',response.data);
      return response.data;
    }, (err) => {
      console.error(err);
    });
  },
};
