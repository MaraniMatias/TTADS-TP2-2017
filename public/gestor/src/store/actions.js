import axios from 'axios';
import _ from 'lodash';
const baseURL = "http://0.0.0.0:3000/api";

// Equipos
export default {
  getEquipos: function({ commit, state }){
    axios.get(`${baseURL}/equipos`)
        .then((response) => {
          const message = _.get(response, 'data.message', '') || '';
          const equipos = _.get(response, 'data.data', []) || [];
          if (message === 'Success') {
            commit('set_equipo_store', equipos);
          }
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
    axios.put(baseURL + "/equipos/"+obj._id, obj)
      .then((response) => {
        commit('update_equipo_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },

  //Partidos
  getPartido: function({ commit, state },id){
    axios.get(baseURL+"/partidos/"+id)
        .then((response) => {
          return response.data;
        }, (err) => {
          console.error(err);
        });
  },
  getPartidos: function({ commit, state }){
    axios.get(`${baseURL}/partidos`)
        .then((response) => {
          const message = _.get(response, 'data.message', '') || '';
          const partidos = _.get(response, 'data.data', []) || [];
          if (message === 'Success') {
            commit('set_partido_store', partidos);
          }
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
    axios.put(baseURL + "/partidos/"+obj._id, obj)
      .then((response) => {
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


  //Tipos Evento
  getTiposEvento: function({ commit, state }){
    axios.get(`${baseURL}/tipos-evento/`)
        .then((response) => {
          const message = _.get(response, 'data.message', '') || '';
          const tiposEvento = _.get(response, 'data.data', []) || [];
          commit('set_tipo_evento_store',tiposEvento);
        }, (err) => {
          console.error(err);
        });
  },
  setTipoEvento: function ({ commit, state }, obj) {
    axios.post(baseURL + "/tipos-evento/", obj)
      .then((response) => {
        commit('add_tipo_evento_to_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  updateTipoEvento: function ({ commit, state }, obj) {
    axios.put(baseURL + "/tipos-evento/"+obj._id, obj)
      .then((response) => {
        commit('update_tipo_evento_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  deleteTipoEvento: function({ commit, state }, obj){
    axios.delete(baseURL+ "/tipos-evento/"+obj._id)
    .then((response) => {
      commit('delete_tipo_evento_from_store',response.data);
      return response.data;
    }, (err) => {
      console.error(err);
    });
  },

  //Torneos
  getTorneos: function({ commit, state }){
    axios.get(baseURL+"/torneos")
        .then((response) => {
          const message = _.get(response, 'data.message', '') || '';
          const torneos = _.get(response, 'data.data', []) || [];
          commit('set_torneos_store', torneos);
        }, (err) => {
          console.error(err);
        });
  },
  setTorneo: function ({ commit, state }, obj) {
    axios.post(baseURL + "/torneos/", obj)
      .then((response) => {
        commit('add_torneo_to_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  },
  deleteTorneo: function({ commit, state }, obj){
    axios.delete(baseURL+ "/torneos/"+obj._id)
    .then((response) => {
      commit('delete_torneo_from_store',response.data);
      return response.data;
    }, (err) => {
      console.error(err);
    });
  },
  updateTorneo: function ({ commit, state }, obj) {
    console.log(obj);
    axios.put(baseURL + "/torneos/"+obj._id, obj)
      .then((response) => {
        commit('update_torneo_store',response.data);
        return response.data;
      }, (err) => {
        console.error(err);
      });
  }
};
