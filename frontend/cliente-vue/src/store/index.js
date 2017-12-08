import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

export default {
  state: {
    equipos: {
      results: []
    },
    partidos: {
      results: []
    }
  },
  actions,
  mutations,
  getters,
  modules: {}
}
