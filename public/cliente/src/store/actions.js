import axios from 'axios'
const baseURL = 'http://localhost:3000/api'

// Equipos
export default {
  getEquipos: function ({ commit, state }) {
    axios.get(baseURL + '/equipos')
        .then((response) => {
          commit('set_equipo_store', response.data)
        }, (err) => {
          console.error(err)
        })
  },

  //  Partidos
  getPartidos: function ({ commit, state }) {
    axios.get(baseURL + '/partidos')
        .then((response) => {
          commit('set_partido_store', response.data)
        }, (err) => {
          console.error(err)
        })
  }
}
