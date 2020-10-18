import axios from 'axios'

//synchronous action creator
const fetchAvailableQueryParamsSuccess = data => ({
    type: 'FETCH_AVAILABLE_QUERY_PARAMS_SUCCESS',
    payload: data
})

const fetchNetworksSuccess = data => ({
  type: 'FETCH_NETWORK_SUCCESS',
  payload: data
})

/*asynchronous thunk action creator
  calls the api, then dispatches the synchronous action creator
*/

export const fetchNetworks = (networkID) => {
  return async dispatch => {
    try {
      const graphqlQuery = {
        query: `{
          networkById(id: "${networkID}"){
              id
              text
              year
              corpusId
              sourceId
              absFreq
              relFreq
              threshold
              nodes {
                  id
                  clusterId
                  text
                  pos
                  similarity
                  absFreq
                  relFreq
              }
              connections {
                  node1
                  node2
                  similarity
              }
          }
        }`
      };
      const response = await axios.post('https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql', graphqlQuery);
      dispatch(fetchNetworksSuccess(response.data.data.networkById));
    }
    catch(e){
        console.log(e)
    }
  }
}

export const fetchAvailableQueryParams =  () => {
    return async dispatch => {
        try {
          const graphqlQuery = {
            query: `{
              allAvailableCorpora {
                  id
                  name
                  sources {
                      id
                      name
                      networks {
                          id
                          text
                          year
                      }
                  }
              }
            }`
          };
          const response = await axios.post('https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql', graphqlQuery);
          dispatch(fetchAvailableQueryParamsSuccess(response.data.data.allAvailableCorpora));
        }
        catch(e){
            console.log(e)
        }
    }
}