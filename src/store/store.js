import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

const graphqlEndpoint = 'https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql'

const store = new Vuex.Store({
  state: {
    availableQueryParams: [],
    selectedCorpus: {id: '', name: '', sources: []},
    selectedSubcorpus: {id: '', name: '', targetWords: []},
    selectedTargetword: {id: '', text: ''},
    egoNetworks: [],
  },
  mutations: {
    changeSelectedCorpus (state, corpus) {
      if (corpus) {
        state.selectedCorpus = corpus;
      } else {
        state.selectedCorpus = state.availableQueryParams[0];
      }
      this.commit('changeSelectedSubcorpus', false);
    },
    changeSelectedSubcorpus (state, subcorpus) {
      if (subcorpus) {
        state.selectedSubcorpus = subcorpus;
      } else {
        state.selectedSubcorpus = state.selectedCorpus.sources[0];
      }
      this.commit('changeSelectedTargetword', false);
    },
    changeSelectedTargetword (state, targetword) {
      if (targetword) {
        state.selectedTargetword = targetword;
      } else {
        state.selectedTargetword = state.selectedSubcorpus.targetWords[0];
      }
    },
    addEgoNetwork (state, networkObj) {
      state.egoNetworks.push(networkObj);
    },
    removeEgoNetwork(state, networkID) {
      const selectedNetworkIndex = state.egoNetworks.findIndex(obj => {
        return obj.text === networkID;
      });
      state.egoNetworks.splice(selectedNetworkIndex, 1);
    }
  },
  getters: {
    availableQueryParams: (state) => state.availableQueryParams,
    selectedCorpus: (state) => state.selectedCorpus,
    selectedSubcorpus: (state) => state.selectedSubcorpus,
    selectedTargetword: (state) => state.selectedTargetword,
    egoNetworks: (state) => state.egoNetworks,
  },
  actions: {
    async loadAvailableQueryParams({state}) {
      try {
        const graphqlQuery = {
          query: `{
            allAvailableCorpora {
              id
              name
              sources {
                name
                targetWords {
                  id
                  text
                  pos
                  networks {
                    id
                    year
                  }
                }
              }
            }
          }`
        };
        const response = await axios.post(graphqlEndpoint, graphqlQuery);
        state.availableQueryParams = response.data.data.allAvailableCorpora;
        state.selectedCorpus = response.data.data.allAvailableCorpora[0];
        state.selectedSubcorpus = response.data.data.allAvailableCorpora[0].sources[0];
        state.selectedTargetword = response.data.data.allAvailableCorpora[0].sources[0].targetWords[0];
      } catch (error) {
        console.log(error);
      }
    },
    async loadEgoNetwork({state}) {
      try {
        const graphqlQuery = {
          query: `{
            getNetwork(targetword_id: "${state.selectedTargetword.id}", year:${state.selectedTargetword.networks[0].year}){
                id
                year
                nodes {
                    id
                    clusterId
                    text
                    pos
                    similarity
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
        const networkID = state.selectedTargetword.id+state.selectedTargetword.networks[0].year
        let network = response.data.data.getNetwork;
        network.id = networkID
        network.corpus = state.selectedCorpus.name
        network.source = state.selectedSubcorpus.name
        network.text = state.selectedTargetword.text
        this.commit('addEgoNetwork', network);
      } catch (error) {
        console.log(error);
      }
    },
  }
})

export default store;
