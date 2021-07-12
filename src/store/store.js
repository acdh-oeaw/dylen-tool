import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import props from "../properties/propertiesLoader";
import {allAvailableCorporaQuery, getNetworkQuery} from "@/queries/queries";

Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.prototype.$properties = props; //to be able to access in modules

Vue.use(Vuex);

const graphqlEndpoint = props.graphqlEndpoint;

const logger = require("../helpers/logger");

const mainModule = {
    namespaced: true,
    state: {
        selectionColors: ["blue", "red"],
        availableQueryParams: [],
        pane1: {
            selectedCorpus: {id: '', name: '', sources: []},
            selectedSubcorpus: {id: '', name: '', targetWords: []},
            selectedTargetword: {id: '', text: ''},
            selectedYear: null,
            selectedNetwork: null
        },
        pane2: {
            selectedCorpus: {id: '', name: '', sources: []},
            selectedSubcorpus: {id: '', name: '', targetWords: []},
            selectedTargetword: {id: '', text: ''},
            selectedYear: null,
            selectedNetwork: null
        },
        nodeMetrics: {
            selectedNodes: []
        }
    },
    mutations: {
        changeSelectedCorpus(state, payload) {
            if (payload.corpus) {
                state[payload.pane].selectedCorpus = payload.corpus;
            } else {
                state[payload.pane].selectedCorpus = state[payload.pane].availableQueryParams[0];
            }
            this.commit('main/changeSelectedSubcorpus', {pane: payload.pane});
        },
        changeSelectedSubcorpus(state, payload) {
            if (payload.subcorpus) {
                state[payload.pane].selectedSubcorpus = payload.subcorpus;
            } else {
                state[payload.pane].selectedSubcorpus = state[payload.pane].selectedCorpus.sources[0];
            }
            this.commit('main/changeSelectedTargetword', {pane: payload.pane});
        },
        changeSelectedTargetword(state, payload) {
            if (payload.targetword) {
                state[payload.pane].selectedTargetword = payload.targetword;
            } else {
                state[payload.pane].selectedTargetword = state[payload.pane].selectedSubcorpus.targetWords[0];
            }
            this.commit('main/changeSelectedYear', {pane: payload.pane});
        },
        changeSelectedYear(state, payload) {
            if (payload.year) {
                state[payload.pane].selectedYear = payload.year;
            } else {
                state[payload.pane].selectedYear = state[payload.pane].selectedTargetword.networks[0]
            }
        },
        addSelectedNodeForNodeMetrics(state, payload) {
            state["nodeMetrics"].selectedNodes.push(payload)
        },
        removeSelectedNodeForNodeMetrics(state, payload) {
            let payloadIndex = state["nodeMetrics"].selectedNodes.indexOf(payload);
            state["nodeMetrics"].selectedNodes.splice(payloadIndex, 1);
        },
        // TODO: check if this is still used.
        addEgoNetwork(state, payload) {
            state[payload['pane']].selectedNetwork = payload.network
        },
        updateEgoNetwork(state, payload) {
            state[payload.pane].selectedNetwork = payload.networkObj
            logger.log("Updated Ego Network for pane " + payload.pane)
        }

    },
    getters: {
        selectionColors: (state) => state.selectionColors,
        availableQueryParams: (state) => state.availableQueryParams,
        selectedCorpus: (state) => (pane) => state[pane].selectedCorpus,
        selectedSubcorpus: (state) => (pane) => state[pane].selectedSubcorpus,
        selectedTargetword: (state) => (pane) => state[pane].selectedTargetword,
        selectedYear: (state) => (pane) => state[pane].selectedYear,
        getPane: (state) => (pane) => state[pane],
        selectedNodesForMetrics: (state) => state["nodeMetrics"].selectedNodes
    },
    actions: {
        async loadAvailableQueryParams({state}) {
            try {
                const response = await axios.post(graphqlEndpoint, allAvailableCorporaQuery);
                state.availableQueryParams = response.data.data.allAvailableCorpora;

                state.pane1.selectedCorpus = response.data.data.allAvailableCorpora[0];
                state.pane1.selectedSubcorpus = response.data.data.allAvailableCorpora[0].sources[0];
                state.pane1.selectedTargetword = response.data.data.allAvailableCorpora[0].sources[0].targetWords[0];
                state.pane1.selectedYear = response.data.data.allAvailableCorpora[0].sources[0].targetWords[0].networks[0]

                state.pane2.selectedCorpus = response.data.data.allAvailableCorpora[0];
                state.pane2.selectedSubcorpus = response.data.data.allAvailableCorpora[0].sources[0];
                state.pane2.selectedTargetword = response.data.data.allAvailableCorpora[0].sources[0].targetWords[0];
                state.pane2.selectedYear = response.data.data.allAvailableCorpora[0].sources[0].targetWords[0].networks[0]
                logger.log('Query parameters loaded successfully.')
            } catch (error) {
                logger.error(error);
            }
        },
        async loadEgoNetwork({state}, pane) {
            let year_param = state[pane].selectedYear ? state[pane].selectedYear.year : state[pane].selectedTargetword.networks[0].year

            try {
                const response = await axios.post(graphqlEndpoint,
                    getNetworkQuery(state[pane].selectedTargetword.id, year_param));
                const networkID = state[pane].selectedTargetword.id + state[pane].selectedYear.year
                let network = response.data.data.getNetwork;
                network.id = networkID
                network.targetWordId = state[pane].selectedTargetword.id
                network.corpus = state[pane].selectedCorpus.name
                network.subcorpus = state[pane].selectedSubcorpus.name
                network.text = state[pane].selectedTargetword.text
                network.possibleYears = state[pane].selectedTargetword.networks.map(n => n.year)
                logger.log('Ego Network loaded successfully.')

                const payload = {
                    pane: pane,
                    network: network
                }
                this.commit('main/addEgoNetwork', payload);
            } catch (error) {
                logger.error(error);
            }
        },
        async loadUpdatedEgoNetwork(state, {network: oldNetwork, pane: pane}) {
            try {

                const response = await axios.post(graphqlEndpoint,
                    getNetworkQuery(oldNetwork.targetWordId, oldNetwork.year));

                const networkID = oldNetwork.targetWordId + oldNetwork.year
                let updatedNetwork = response.data.data.getNetwork;

                updatedNetwork.id = networkID
                updatedNetwork.targetWordId = oldNetwork.targetWordId
                updatedNetwork.corpus = oldNetwork.corpus
                updatedNetwork.subcorpus = oldNetwork.subcorpus
                updatedNetwork.text = oldNetwork.text
                updatedNetwork.possibleYears = oldNetwork.possibleYears
                logger.log('Ego Network %s updated successfully.', networkID)

                this.commit('main/updateEgoNetwork', {networkObj: updatedNetwork, pane: pane});
            } catch (error) {
                logger.error(error);
            }
        }
    }
}


const sautoModule = {
    namespaced: true,
    state: {
        connection: null,
        lastOverElement: null,
        sauto: false,
    },
    actions: {
        async connect({state}) {
            if (state.sauto) {
                console.log(props.sautoURI);
                state.connection = new WebSocket(props.sautoURI); //todo get url from properties file
                state.connection.onerror = function (event) {
                    logger.error(event);
                };
                state.connection.onopen = function () {
                    logger.log("Connection with Sauto backed established successfully.");
                };
            }
        },
        agree({state}, {agreed}) {
            state.sauto = agreed;
            if (agreed) {
                this.dispatch("sauto/connect");
            }
        },
        async handleMouseMove({state}, {movement}) {
            //send mouse positions
            movement.type = "MousePosition";
            state.connection.send(JSON.stringify(movement));
        },
        async handleMouseOver({state}, {mouseOver}) {
            //send if mouseover new component
            if (mouseOver.id !== null) {
                if (mouseOver.id !== state.lastOverElement) {
                    mouseOver.type = "MouseOver";
                    state.connection.send(JSON.stringify(mouseOver));
                    state.lastOverElement = mouseOver.id;
                }
            }
        },
        async handleMouseClick({state}, {click}) {
            //send mouse click
            click.type = "MouseClick";
            state.connection.send(JSON.stringify(click));
        },
        async handleScroll({state}, {scroll}) {
            //send mouse scroll
            scroll.type = "Scroll";
            state.connection.send(JSON.stringify(scroll));
        },
    },
};
const store = new Vuex.Store({
    modules: {
        main: mainModule,
        sauto: sautoModule,
    },
});

Vue.mixin({
    methods: {
        mouseOver(event) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }

            const element = this.getNearestSautoId(event.target);

            const mouseOver = {
                id: element.getAttribute("data-sauto-id"),
                timestamp: Date.now(),
            };
            this.$store.dispatch("sauto/handleMouseOver", {mouseOver});
        },
        mouseMove(event) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }

            const movement = this.calculateMousePosition(event);
            this.$store.dispatch("sauto/handleMouseMove", {movement});
        },
        scroll(event) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }

            const element = this.getNearestSautoId(event.target);

            const scroll = {
                id: element.getAttribute("data-sauto-id"),
                height: event.deltaY,
            };

            this.$store.dispatch("sauto/handleScroll", {scroll});
        },
        mouseClick(event) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }
            const click = this.calculateMousePosition(event);

            const element = this.getNearestSautoId(event.target);

            click.id = element.getAttribute("data-sauto-id");
            click.timestamp = Date.now();

            this.$store.dispatch("sauto/handleMouseClick", {click});
        },
        calculateMousePosition(event) {
            //get mouse position in percentage relative to top element size
            const elementSizes = this.$refs.app.getBoundingClientRect();
            const x = event.clientX - elementSizes.left;
            const y = event.clientY - elementSizes.top;

            const positions = {
                x: (x * 100) / elementSizes.width,
                y: (y * 100) / elementSizes.height,
            };
            return positions;
        },
        getNearestSautoId(element) {
            if (element.getAttribute("data-sauto-id") === null) {
                // go up in tree until an element with this attribute is found
                while (
                    (element = element.parentElement) &&
                    !element.getAttribute("data-sauto-id")
                    ) ;
            }
            return element;
        },
    },
});

export default store;
