import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

const graphqlEndpoint = 'https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql'

const mainModule = {
    namespaced: true,
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
            this.commit('main/changeSelectedSubcorpus', false);
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
            this.commit('main/changeSelectedTargetword', false);
        },
        changeSelectedTargetword (state, networkID) {
            let selectedNetworkObj;
            if (networkID) {
                selectedNetworkObj = state.selectedSubcorpus.targetWords.find(obj => {
                    return obj.id === networkID.id;
                });
            } else {
                selectedNetworkObj = state.selectedSubcorpus.targetWords[0];
                state.selectedTargetwordID = selectedNetworkObj.id;
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
                state.selectedCorpusID = response.data.data.allAvailableCorpora[0].id;
                state.selectedSubcorpusID = response.data.data.allAvailableCorpora[0].sources[0].name;
                state.selectedTargetwordID = response.data.data.allAvailableCorpora[0].sources[0].targetWords[0].id;
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
                this.commit('main/addEgoNetwork', network);
            } catch (error) {
                console.log(error);
            }
        },
    }
}

const sautoModule = {
    namespaced: true,
    state: {
        connection: new WebSocket("ws://localhost:8081/app"),
        lastOverElement: null,
        mouseOverComponents: ["sidebar", "results"] //add here if any new components come up
    },
    actions: {
        async handleMouseMove({state}, {movement}) {
            //send mouse positions
            const message = {
                type: "MousePosition",
                x: movement.x,
                y: movement.y
            }
            state.connection.send(JSON.stringify(message));
        },
        async handleMouseOver({state}, {mouseOver}) {

            //send if mouseover new component
            if(state.mouseOverComponents.includes(mouseOver.id)){
                if (mouseOver.id !== state.lastOverElement){
                    mouseOver.type="Component"
                    state.connection.send(JSON.stringify(mouseOver));
                    state.lastOverElement = mouseOver.id
                }
            }
        }
    }
}
const store = new Vuex.Store({
    modules: {
        main: mainModule,
        sauto: sautoModule
    }
})


export default store;
