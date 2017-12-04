export default {
  findPartido: (state) => partidoId => {
    for (var i = 0; i < state.partidos.length; i++) {
      if (state.partidos[i]._id === partidoId) {
        return state.partidos[i]
      }
    }
  }
}
