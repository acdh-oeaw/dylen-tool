import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

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
                  text
                  pos
                  networks {
                    id
                    year
                    absFreq
                    relFreq
                    threshold
                  }
                }
              }
            }
          }`
        };
        const response = await axios.post('https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql', graphqlQuery);
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
            networkById(id: "${state.selectedTargetword.networks[0].id}"){
                id
                text
                year
                corpus
                source
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
        this.commit('addEgoNetwork', response.data.data.networkById)
      } catch (error) {
        console.log(error);
      }
    },
  }
})

export default store;
