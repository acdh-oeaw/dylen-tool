export const corpora = (state = [] , action) => {
  switch(action.type) {
      case 'FETCH_CORPORA_SUCCESS':
        return action.payload.corpora
      default:
        return state
  }
}

export const networks = (state = [] , action) => {
  switch(action.type) {
      case 'FETCH_NETWORKS_SUCCESS':
        return action.payload.networks
      default:
        return state
  }
}