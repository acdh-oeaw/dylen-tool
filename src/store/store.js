import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import props from "../properties/propertiesLoader";
import {
    allAvailableCorporaQuery,
    getNetworkQuery,
    getSoucesByCorpusQuery,
    getNetworksByCorpusAndSource
} from "@/queries/queries";
import {ExportToCsv} from 'export-to-csv';

Vue.prototype.axios = axios;
Vue.use(Vuex);

const graphqlEndpoint = props.graphqlEndpoint;
const logger = require("../helpers/logger");

const nodesToJSON = (state, nodes) => {
    return nodes.map((node) => {
        let tableEntry = {
            Word: node.name,
            Network: `${
                state[node._pane].selectedTargetword.text
            } (${
                state[node._pane].selectedNetwork.year
            })`,

        };
        for (let key in node._metrics)
            tableEntry[key] = node._metrics[key];

        return tableEntry;
    });
}

const mainModule = {
    actions: {
        async initCorpora({dispatch}) {
            const response = await axios.post(graphqlEndpoint, allAvailableCorporaQuery);
            const corporaPayload = {
                corpora: response.data.data.allAvailableCorpora
            }
            this.commit('main/loadCorpora', corporaPayload);
            await dispatch("initSources")
        },
        async initSources({dispatch, state}) {
            for (const corpus of state.availableCorpora) {
                const sourceResponse = await axios.post(graphqlEndpoint, getSoucesByCorpusQuery(corpus))
                const sourcesPayload = {
                    corpus: corpus,
                    sources: sourceResponse.data.data.getSourcesByCorpus
                }
                this.commit('main/loadSourcesOfCorpus', sourcesPayload)
            }
            this.commit("main/selectInitValues", {pane: "pane1"})
            this.commit("main/selectInitValues", {pane: "pane2"})

            await dispatch("initTargetwords", "pane1")
            await dispatch("initTargetwords", "pane2")
        },
        async initTargetwords({state}, pane) {
            const targetwordsResponse = await axios.post(graphqlEndpoint,
                getNetworksByCorpusAndSource(state[pane].selectedCorpus, state[pane].selectedSubcorpus, 0, 20))
            const payload = {
                pane: pane,
                targetWords: targetwordsResponse.data.data.getNetworksByCorpusAndSource.targetWords
            }
            this.commit("main/loadTargetwordsOfCorpusAndSource", payload)
            this.commit("main/selectInitTargetWord", {pane: "pane1"})
            this.commit("main/selectInitTargetWord", {pane: "pane2"})
        },
        async loadAvailableCorpora({dispatch}) {
            try {
                await dispatch("initCorpora")
                logger.log('Query parameters loaded successfully.')
            } catch (error) {
                logger.error(error);
            }
        },
        async loadEgoNetwork({state}, pane) {
            function assignValuesFromState(network, networkID) {
                network.id = networkID
                network.targetWordId = state[pane].selectedTargetword.id
                network.corpus = state[pane].selectedCorpus
                network.subcorpus = state[pane].selectedSubcorpus
                network.text = state[pane].selectedTargetword.text
                network.possibleYears = state[pane].selectedTargetword.networks.map(n => n.year)
            }

            let year_param = state[pane].selectedYear ? state[pane].selectedYear.year : state[pane].selectedTargetword.networks[0].year

            try {
                const response = await axios.post(graphqlEndpoint,
                    getNetworkQuery(state[pane].selectedTargetword.id, year_param));
                const networkID = state[pane].selectedTargetword.id + state[pane].selectedYear.year
                let network = response.data.data.getNetwork;

                assignValuesFromState(network, networkID);

                const payload = {
                    pane: pane,
                    network: network
                }

                this.commit('main/addEgoNetwork', payload);
                logger.log('Ego Network loaded successfully.')

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
        },
        async downloadMetricsAsCSV({state}, nodes) {
            let data = nodesToJSON(state, nodes);
            const options = {
                filename: "DYLEN_Export",
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                showTitle: false,
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: true,
            };

            const csvExporter = new ExportToCsv(options);
            csvExporter.generateCsv(data);
        },
        async downloadMetricsAsJSON({state}, nodes) {
            let exportName = "DYLEN_Export";
            let data = nodesToJSON(state, nodes);
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", exportName + ".json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    },
    namespaced: true,
    state: {
        selectionColors: ["#1E88E5", "#D81B60"],
        availableCorpora: [],
        availableSourcesByCorpus: {},
        availableTargetwordsByCorpusAndSource: {},
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
        },
        posColors: {
            noun: '#aa0000',
            verb: '#000088',
            adjective: '#f18e04',
            proper_noun: '#000000',
        },
        labelOptions: {
            fontSize: 12,
            bold: false,
            background: true
        },
        linkOptions: {
            opacity: 0.25
        },
        tableOptions: {
            digits: 3,
            selectedOnTop: true
        }
    },
    mutations: {
        loadCorpora(state, payload) {
            state.availableCorpora = payload.corpora;
        },
        loadSourcesOfCorpus(state, payload) {
            Vue.set(state.availableSourcesByCorpus, payload.corpus, payload.sources);
        },
        loadTargetwordsOfCorpusAndSource(state, payload) {
            if (!state.availableTargetwordsByCorpusAndSource[state[payload.pane].selectedCorpus]) {
                Vue.set(state.availableTargetwordsByCorpusAndSource, state[payload.pane].selectedCorpus, {});
            }
            Vue.set(state.availableTargetwordsByCorpusAndSource[state[payload.pane].selectedCorpus], state[payload.pane].selectedSubcorpus, payload.targetWords);
        },
        selectInitValues(state, payload) {
            state[payload.pane].selectedCorpus = state.availableCorpora[0];
            state[payload.pane].selectedSubcorpus = state.availableSourcesByCorpus[state[payload.pane].selectedCorpus][0];
        },
        selectInitTargetWord(state, payload) {
            state[payload.pane].selectedTargetword = state.availableTargetwordsByCorpusAndSource[state[payload.pane].selectedCorpus][state[payload.pane].selectedSubcorpus][0]
            state[payload.pane].selectedYear = state[payload.pane].selectedTargetword.networks[0]
        },
        changeSelectedCorpus(state, payload) {
            if (payload.corpus) {
                state[payload.pane].selectedCorpus = payload.corpus;
            } else {
                state[payload.pane].selectedCorpus = state[payload.pane].availableCorpora()[0];
            }
        },
        changeSelectedSubcorpus(state, payload) {
            if (payload.subcorpus) {
                state[payload.pane].selectedSubcorpus = payload.subcorpus;
            } else {
                state[payload.pane].selectedSubcorpus = state[payload.pane].selectedCorpus.sources[0];
            }
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
        availableCorpora: (state) => state.availableCorpora,
        selectedCorpus: (state) => (pane) => state[pane].selectedCorpus,
        availableSourcesByCorpus: (state) => (selectedCorpus) => state['availableSourcesByCorpus'][selectedCorpus],
        selectedSubcorpus: (state) => (pane) => state[pane].selectedSubcorpus,
        targetwordsOfCorpusAndSource: (state) => (corpus, selectedSubcorpus) => {
            if (!state.availableTargetwordsByCorpusAndSource[corpus] || !state.availableTargetwordsByCorpusAndSource[corpus][selectedSubcorpus])
                return []
            return state.availableTargetwordsByCorpusAndSource[corpus][selectedSubcorpus]
        },
        selectedTargetword: (state) => (pane) => state[pane].selectedTargetword,
        selectedYear: (state) => (pane) => state[pane].selectedYear,
        getPane: (state) => (pane) => state[pane],
        selectedNodesForMetrics: (state) => state["nodeMetrics"].selectedNodes,
        posColors: (state) => state.posColors,
        labelOptions: (state) => state.labelOptions,
        linkOptions: (state) => state.linkOptions,
        tableOptions: (state) => state.tableOptions,
    },
    setPosColor({state}, posTag, colorCode) {
        state.posColors[posTag] = colorCode;
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
                logger.log(props.sautoURI);
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
