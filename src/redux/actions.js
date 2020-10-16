import axios from 'axios'

//synchronous action creator
const fetchCorporaSuccess = corpora => ({
    type: 'FETCH_CORPORA_SUCCESS',
    payload: { corpora }
})

const fetchNetworksSuccess = networks => ({
  type: 'FETCH_NETWORKS_SUCCESS',
  payload: { networks }
})

/*asynchronous thunk action creator
  calls the api, then dispatches the synchronous action creator
*/

export const fetchNetworks =  () => {
  return async dispatch => {
    try {
      dispatch(fetchNetworksSuccess({id: "1", name: "hi, this is network"}))
    }
    catch(e){
        console.log(e)
    }
  }
}

export const fetchCorpora =  () => {
    return async dispatch => {
        try {
          const corporaQuery = {
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
          const corpora = await axios.post('https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql', corporaQuery);
          dispatch(fetchCorporaSuccess(corpora.data.data));
        }
        catch(e){
            console.log(e)
        }
    }
}