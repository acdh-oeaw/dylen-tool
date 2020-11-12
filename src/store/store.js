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
    selectedCorpusID: '',
    selectedSubcorpusID: '',
    selectedTargetwordID: '',
    egoNetworks: [],
  },
  mutations: {
    changeSelectedCorpus (state, corpusID) {
      let selectedCorpusObj;
      if (corpusID) {
        selectedCorpusObj = state.availableQueryParams.find(obj => {
          return obj.id === corpusID;
        });
      } else {
        selectedCorpusObj = state.availableQueryParams[0];
        state.selectedCorpusID = selectedCorpusObj.id;
      }
      state.selectedCorpus = selectedCorpusObj;
      this.commit('changeSelectedSubcorpus', false);
    },
    changeSelectedSubcorpus (state, subcorpusID) {
      let selectedSubcorpusObj;
      if (subcorpusID) {
        selectedSubcorpusObj = state.selectedCorpus.sources.find(obj => {
          return obj.name === subcorpusID;
        });
      } else {
        selectedSubcorpusObj = state.selectedCorpus.sources[0];
        state.selectedSubcorpusID = selectedSubcorpusObj.name;
      }
      state.selectedSubcorpus = selectedSubcorpusObj;
      this.commit('changeSelectedTargetword', false);
    },
    changeSelectedTargetword (state, networkID) {
      let selectedNetworkObj;
      if (networkID) {
        selectedNetworkObj = state.selectedSubcorpus.targetWords.find(obj => {
          return obj.text === networkID;
        });
      } else {
        selectedNetworkObj = state.selectedSubcorpus.targetWords[0];
        state.selectedTargetwordID = selectedNetworkObj.text;
      }
      state.selectedTargetword = selectedNetworkObj;
    },
    changeSelectedCorpusID (state, corpusID) {
      state.selectedCorpusID = corpusID;
    },
    changeSelectedSubcorpusID (state, subcorpusID) {
      state.selectedSubcorpusID = subcorpusID;
    },
    changeSelectedTargetwordID (state, networkID) {
      state.selectedTargetwordID = networkID;
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
    selectedCorpusID: (state) => state.selectedCorpusID,
    selectedSubcorpusID: (state) => state.selectedSubcorpusID,
    selectedTargetwordID: (state) => state.selectedTargetwordID,
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
        state.selectedCorpusID = response.data.data.allAvailableCorpora[0].id;
        state.selectedSubcorpusID = response.data.data.allAvailableCorpora[0].sources[0].name;
        state.selectedTargetwordID = response.data.data.allAvailableCorpora[0].sources[0].targetWords[0].text;
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
