import Vue from 'vue';
import Vuex from 'vuex';
import VueCompositionAPI from '@vue/composition-api'

import axios from 'axios';
import {
    corpusNameMapping,
    sourceNameMapping,
    zipTimeSeriesAndYears,
    partyMapping,
    filterBasedOnSlider
} from '@/helpers/mappers';
import props from '../properties/propertiesLoader';
import {
    allAvailableCorporaQuery,
    getAvailablePartiesQuery,
    getAutocompleteSuggestionsQuery,
    getNetworkQuery,
    getSourcesByCorpusQuery,
    getTargetWordByIdQuery,
    getGeneralNetworkQuery,
    getSpeakersForParty,
    getAvailableYearsForParty,
    getGeneralNetworkTimeSeries,
    getGeneralSpeakerNetworkQuery,
    getMetadataSpeaker
} from '@/queries/queries';
import { ExportToCsv } from 'export-to-csv';

Vue.prototype.axios = axios;
Vue.use(Vuex);
Vue.use(VueCompositionAPI);

const graphqlEndpoint = props.graphqlEndpoint;
const logger = require('../helpers/logger');

function compare(source1, source2) {
  if (source1.name < source2.name) {
    return -1;
  }
  if (source1.name > source2.name) {
    return 1;
  }
  return 0;
}

const nodesToJSON = (state, allNodes, selectedNodes) => {
  return allNodes.map((node) => {
    const selected = !!selectedNodes.find(n => n.id === node.id);
    let tableEntry = {
      Word: node.name,
      Selected: selected,
      Network: `${
        state[node._pane].selectedTargetword.text
      } (${
        state[node._pane].selectedNetwork.year
      })`
    };
    for (let key in node._metrics)
      tableEntry[key] = node._metrics[key];

    return tableEntry;
  });
};


const mainModule = {
    actions: {
        async initCorpora({ dispatch }) {
            const response = await axios.post(graphqlEndpoint, allAvailableCorporaQuery);
            const corporaPayload = {
                corpora: response.data.data.allAvailableCorpora
            };
            this.commit('main/loadCorpora', corporaPayload);
            await dispatch('loadSources');
        },
        async initParties({dispatch}) {
            const response = await axios.post(graphqlEndpoint, getAvailablePartiesQuery);
            const partyPayload = {
                parties: response.data.data.parties
            };
            this.commit('main/loadParties', partyPayload);
            await dispatch('loadSources');
        },
        async speakersForParty({state}, pane) {
          let party = partyMapping[state[pane].selectedParty];
          const response = await axios.post(graphqlEndpoint, getSpeakersForParty(party));
          const speakerResponse = response.data.data.findSpeakerByParty;
          const payload = {speakers: speakerResponse.speakers.sort(), pane: pane};
          this.commit('main/changeAvailableSpeakers', payload);
        },
        async loadSources({ state }) {
            for (const corpus of state.availableCorpora) {
                const sourceResponse = await axios.post(graphqlEndpoint, getSourcesByCorpusQuery(corpus.id));
                const sourcesPayload = {
                    corpus: corpus.id,
                    sources: sourceResponse.data.data.getSourcesByCorpus
                };
                this.commit('main/loadSourcesOfCorpus', sourcesPayload);
            }
            this.commit('main/selectInitValues', {pane: 'pane1'});
            this.commit('main/selectInitValues', {pane: 'pane2'});

    },

    async loadAvailableCorpora({ dispatch }) {
      try {
        await dispatch('initCorpora');
        logger.log('Query parameters loaded successfully.');
      } catch (error) {
        logger.error(error);
      }
    },
    async loadAvailableParties({ dispatch }) {
      try {
        await dispatch('initParties');
        logger.log('Query parameters loaded successfully.');
      } catch (error) {
        logger.error(error);
      }
    },
    async loadAvailableSpeakers({ dispatch }, party) {
      try {
        await dispatch('speakersForParty', party);
        logger.log('Query parameters loaded successfully.');
      } catch (error) {
        logger.error(error);
      }
    },

    async loadGeneralNetwork({state}, {pane: pane, sliderMin: slidValMin, sliderMax: slidValMax}) {
      function assignValuesFromState(network, networkID, years) {
        network.id = networkID;
        network.filter = {metric: state[pane].selectedMetric, valueMin: slidValMin, valueMax: slidValMax};
        network.party = party;
        network.possibleYears = years.map(Number).sort();
        network.year = Math.max(...years.map(Number));
        network.type = 'Party';
      }

      let party = partyMapping[state[pane].selectedParty];

      try {
          const availableYearsQuery = getAvailableYearsForParty(party);
          const yearsResponse = await axios.post(graphqlEndpoint, availableYearsQuery);
          let years = yearsResponse.data.data.getAvailableYearsForParty.available_years;
          let year = Math.max(...years);

          const query = getGeneralNetworkQuery(party, year);
          const response = await axios.post(graphqlEndpoint, query);
          const networkID = party + '_' + year;

          let network = response.data.data.getGeneralSourceByPartyYear.networks;

          assignValuesFromState(network, networkID, years);
          filterBasedOnSlider(network);

          const payload = {
              pane: pane,
              network: network
          };

          this.commit('main/addGeneralNetwork', payload);
          logger.log('General Network loaded successfully.');
      } catch (error) {
          logger.error(error);
      }
    },
    async loadGeneralSpeakerNetwork({state}, {pane: pane, sliderMin: slidValMin, sliderMax: slidValMax}) {
      function assignValuesFromState(network, networkID, possibleYears) {
        network.id = networkID;
        network.speaker = state[pane].selectedSpeaker;
        network.party = partyMapping[state[pane].selectedParty];
        network.possibleYears = possibleYears.map(Number).sort();
        network.filter = {metric: state[pane].selectedMetric, valueMin: slidValMin, valueMax: slidValMax};
        network.year = Math.max(...possibleYears.map(Number));
        network.type = 'Speaker';
      }

      let speaker = state[pane].selectedSpeaker;

      try {
          const yearResponse = await axios.post(graphqlEndpoint, getMetadataSpeaker(speaker));
          let possibleYears = yearResponse.data.data.getAvailableYearsForSpeaker.available_years.sort();
          let maxYear = Math.max(...possibleYears.map(Number));

          const query = getGeneralSpeakerNetworkQuery(speaker);
          const response = await axios.post(graphqlEndpoint, query);

          let network = response.data.data.getGeneralSourceBySpeakerYear.networks.find(nw => nw.year == maxYear);

          const networkID = speaker + '_' + maxYear;
          assignValuesFromState(network, networkID, possibleYears);
          filterBasedOnSlider(network);

          const payload = {
              pane: pane,
              network: network
          };

          this.commit('main/addGeneralSpeakerNetwork', payload);
          logger.log('General Speaker Network loaded successfully.');
      } catch (error) {
          logger.error(error);
      }
    },
    async loadEgoNetwork({ state }, pane) {
      function assignValuesFromState(network, networkID) {
        network.id = networkID;
        network.targetWordId = state[pane].selectedTargetword.id;
        network.corpus = state[pane].selectedCorpus;
        network.subcorpus = state[pane].selectedSubcorpus;
        network.text = state[pane].selectedTargetword.text;
        network.possibleYears = state[pane].selectedTargetword.networks.map(n => n.year).sort();
        network.pos = state[pane].selectedTargetword.pos;
        network.type = 'Ego';
      }

      let year_param = state[pane].selectedYear ? state[pane].selectedYear.year : state[pane].selectedTargetword.networks[0].year;

      try {
        const response = await axios.post(graphqlEndpoint,
          getNetworkQuery(state[pane].selectedTargetword.id, year_param));
        const networkID = state[pane].selectedTargetword.id + state[pane].selectedYear.year;
        let network = response.data.data.getNetwork;

        assignValuesFromState(network, networkID);

        const payload = {
          pane: pane,
          network: network
        };

        this.commit('main/addEgoNetwork', payload);
        logger.log('Ego Network loaded successfully.');
      } catch (error) {
        logger.error(error);
      }
    },
    async loadUpdatedEgoNetwork(state, { network: oldNetwork, pane: pane }) {
      try {
        const response = await axios.post(graphqlEndpoint,
          getNetworkQuery(oldNetwork.targetWordId, oldNetwork.year));

        const networkID = oldNetwork.targetWordId + oldNetwork.year;
        let updatedNetwork = response.data.data.getNetwork;

        updatedNetwork.id = networkID;
        updatedNetwork.targetWordId = oldNetwork.targetWordId;
        updatedNetwork.corpus = oldNetwork.corpus;
        updatedNetwork.subcorpus = oldNetwork.subcorpus;
        updatedNetwork.text = oldNetwork.text;
        updatedNetwork.possibleYears = oldNetwork.possibleYears;
        updatedNetwork.pos = oldNetwork.pos;
        updatedNetwork.type = oldNetwork.type;
        logger.log('Ego Network %s updated successfully.', networkID);

        this.commit('main/updateEgoNetwork', {networkObj: updatedNetwork, pane: pane});
        this.commit('main/changeSelectedYear', {pane: pane, year: updatedNetwork})
      } catch (error) {
        logger.error(error);
      }
    },
    async loadUpdatedGeneralNetwork(state, {network: oldNetwork, pane: pane}) {
        try {
            let response = await axios.post(graphqlEndpoint,
              getGeneralNetworkQuery(oldNetwork.party, oldNetwork.year));
            let networkID = oldNetwork.party + '_' + oldNetwork.year;
            let updatedNetwork = response.data.data.getGeneralSourceByPartyYear.networks;

            console.log(updatedNetwork);
            updatedNetwork.party = oldNetwork.party;
            updatedNetwork.filter = oldNetwork.filter;
            updatedNetwork.id = networkID;
            updatedNetwork.possibleYears = oldNetwork.possibleYears;
            updatedNetwork.year = oldNetwork.year;
            updatedNetwork.type = oldNetwork.type;
            filterBasedOnSlider(updatedNetwork);
            console.log(updatedNetwork);

            logger.log('Network %s updated successfully.', networkID);

            this.commit('main/updateGeneralNetwork', {networkObj: updatedNetwork, pane: pane});
            this.commit('main/changeSelectedYear', {pane: pane, year: updatedNetwork})
          } catch (error) {
            logger.error(error);
          }
        },
        async loadUpdatedSpeakerNetwork(state, {network: oldNetwork, pane: pane}) {
            try {
                const response = await axios.post(graphqlEndpoint,
                  getGeneralSpeakerNetworkQuery(oldNetwork.speaker));

                const networkID = oldNetwork.speaker + '_' + oldNetwork.year;
                let updatedNetwork = response.data.data.getGeneralSourceBySpeakerYear.networks.find(nw => nw.year == oldNetwork.year);

                updatedNetwork.party = oldNetwork.party;
                updatedNetwork.speaker = oldNetwork.speaker;
                updatedNetwork.filter = oldNetwork.filter;
                updatedNetwork.id = networkID;
                updatedNetwork.possibleYears = oldNetwork.possibleYears;
                updatedNetwork.year = oldNetwork.year;
                updatedNetwork.type = oldNetwork.type;
                filterBasedOnSlider(updatedNetwork);

                logger.log('General Network %s updated successfully.', networkID);

                this.commit('main/updateGeneralSpeakerNetwork', {networkObj: updatedNetwork, pane: pane});
                this.commit('main/changeSelectedYear', {pane: pane, year: updatedNetwork})
            } catch (error) {
                logger.error(error);
            }
        },

    async loadAutocompleteSuggestions({ state }, { pane }) {
      const suggestionsResponse = await axios.post(graphqlEndpoint,
        getAutocompleteSuggestionsQuery(state[pane].selectedCorpus.id, state[pane].selectedSubcorpus.id, state[pane].searchTerm));
      this.commit('main/setAutocompleteSuggestions', {
        suggestions: suggestionsResponse.data.data.getAutocompleteSuggestions,
        pane: pane
      });
    },
    async loadAutocompleteSuggestionsForNewSubCorpus({ state, dispatch }, { pane }) {
      const suggestionsResponse = await axios.post(graphqlEndpoint,
        getAutocompleteSuggestionsQuery(state[pane].selectedCorpus.id, state[pane].selectedSubcorpus.id, state[pane].searchTerm));
      const suggestions = suggestionsResponse.data.data.getAutocompleteSuggestions;
      this.commit('main/setAutocompleteSuggestions', {
        suggestions: suggestions,
        pane: pane
      });

      const currentTargetword = state[pane].selectedTargetword;
      let matchingSuggestion = suggestions.find(s => s.text === currentTargetword.text && s.pos === currentTargetword.pos);
      let targetwordPayload = { pane: pane, searchTerm: matchingSuggestion };
      let response = await dispatch('loadTargetwordBySearchTerm', targetwordPayload);

      this.commit('main/changeSelectedTargetword', {
        targetword: response.data.data.getTargetWordById,
        pane: pane
      });


    },
    async downloadMetricsAsCSV({ state }, payload) {
      let data = nodesToJSON(state, payload.allNodes, payload.selectedNodes);
      const options = {
        filename: 'DYLEN_Export',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true
      };

      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(data);
    },
    async downloadMetricsAsJSON({ state }, payload) {
      let exportName = 'DYLEN_Export';
      let data = nodesToJSON(state, payload.allNodes, payload.selectedNodes);
      var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', exportName + '.json');
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    async loadTargetwordBySearchTerm(state, payload) {
      let searchTermId = '';
      if (payload.searchTerm) {
        searchTermId = payload.searchTerm.id;
      }
      const response = await axios.post(graphqlEndpoint,
        getTargetWordByIdQuery(searchTermId));

      console.log(response);

      this.commit('main/changeSelectedTargetword', {
        pane: payload.pane,
        targetword: response.data.data.getTargetWordById
      });

            return response
        },
        async loadTargetwordById({state}, pane) {
            const response = await axios.post(graphqlEndpoint,
                getTargetWordByIdQuery(state[pane].selectedTargetword.id));
            console.log(response)
            return response
        },
        async loadGeneralSpeakerTimeSeriesData({state}, pane) {
          try {
              const response = await axios.post(graphqlEndpoint,
                  getMetadataSpeaker(state[pane].selectedSpeaker));
              let timeSeries = response.data.data.getAvailableYearsForSpeaker || {};
              let years = response.data.data.getAvailableYearsForSpeaker.available_years.sort();

              let data = zipTimeSeriesAndYears({
                "frobeniusSimilarity": timeSeries.frobenius_similarity,
                "rankdcgSimilarity": timeSeries.rankdcg_similarity,
                "jaccardSimilarity": timeSeries.jaccard_similarity
              }, years);

              const payload = {
                  pane: pane,
                  data: data
              };

              this.commit('main/addGeneralSpeakerTimeSeriesData', payload);
              logger.log('General Network loaded successfully.');
          } catch (error) {
              logger.error(error);
          }
        },
        async loadGeneralTimeSeriesData({state}, pane) {
          try {
              const response = await axios.post(graphqlEndpoint,
                  getGeneralNetworkTimeSeries(state[pane].selectedParty.replace('Ö', 'Oe')));
              let timeSeries = response.data.data.getAvailableYearsForParty || {};
              let years = response.data.data.getAvailableYearsForParty.available_years.sort();

              let data = zipTimeSeriesAndYears({
                "frobeniusSimilarity": timeSeries.frobenius_similarity,
                "rankdcgSimilarity": timeSeries.rankdcg_similarity,
                "jaccardSimilarity": timeSeries.jaccard_similarity
              }, years);

              const payload = {
                  pane: pane,
                  data: data
              };

              this.commit('main/addGeneralTimeSeriesData', payload);
              logger.log('General Network loaded successfully.');
          } catch (error) {
              logger.error(error);
          }
        },
        async loadTimeSeriesData({state}, pane) {
            try {
                const response = await axios.post(graphqlEndpoint,
                    getTargetWordByIdQuery(state[pane].selectedTargetword.id));
                let timeSeries = response.data.data.getTargetWordById.timeSeries || {};
                let years = response.data.data.getTargetWordById.networks.map(e => e.year).slice().sort();
                let data = zipTimeSeriesAndYears(timeSeries, years);
                const payload = {
                    pane: pane,
                    data: data
                };

        this.commit('main/addTimeSeriesData', payload);
        logger.log('Ego Network loaded successfully.');
      } catch (error) {
        logger.error(error);
      }
    }

  },
  namespaced: true,
  state: {
    selectionColors: ['#1E88E5', '#D81B60'],
    availableCorpora: [],
    availableSourcesByCorpus: {},
    availableTargetwordsByCorpusAndSource: {},
    topNav: {
      secondForm: false
    },
    focusNode: null,
    pane1: {
      availableSpeakers: [],
      selectedCorpus: { id: '', name: '', sources: [] },
      selectedMetric: {metric: ''},
      selectedParty: {party: ''},
      selectedSpeaker: {speaker: ''},
      selectedSubcorpus: { id: '', name: '', targetWords: [] },
      selectedTargetword: { id: '', text: '' },
      selectedYear: null,
      selectedNetwork: null,
      searchTerm: null,
      autocompleteSuggestions: [],
      timeSeriesData: {}//arbeits_ts.time_series //TODO: change when API is ready
    },
    pane2: {
      availableSpeakers: [],
      selectedCorpus: { id: '', name: '', sources: [] },
      selectedMetric: {metric: ''},
      selectedParty: {party: ''},
      selectedSpeaker: {speaker: ''},
      selectedSubcorpus: { id: '', name: '', targetWords: [] },
      selectedTargetword: { id: '', text: '' },
      selectedYear: null,
      selectedNetwork: null,
      searchTerm: null,
      autocompleteSuggestions: [],
      timeSeriesData: {}//random_ts.time_series //TODO: change when API is ready
    },
    nodeMetrics: {
      selectedNodes: []
    },
    posColors: {
      noun: '#aa0000',
      verb: '#28BAF0',
      adjective: '#f18e04',
      proper_noun: '#000000'
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
      selectedOnTop: false
    },
    showInfo: true,
    availableMetrics: ['Degree Centrality', 'Eigenvector Centrality', 'Closeness Centrality', 'Betweenness Centrality',
      'Pagerank', 'Load Centrality', 'Harmonic Centrality', 'Clustering Coefficient'],
    availableParties: ['SPÖ', 'STRONACH', 'FPÖ', 'GRÜNE', 'ÖVP', 'BZÖ', 'NEOS']
  },
  mutations: {
    changeSecondFormVisibility(state, payload) {
      if (payload.pane === 'pane2') {
        state.topNav.secondForm = !state.topNav.secondForm;
      }
    },
    loadCorpora(state, payload) {
      state.availableCorpora = payload.corpora.map(
        corpus => {
          return {
            id: corpus,
            name: corpusNameMapping[corpus]
          };
        }).sort(compare);
    },
    loadParties(state, payload) {
        state.availableParties = payload.parties.map(
            party => {
                return {
                    id: party,
                    name: party
                }
            }).sort(compare);
    },
    loadSourcesOfCorpus(state, payload) {
      const sources = payload.sources.map(
        source => {
          return {
            id: source,
            name: sourceNameMapping[source]
          };
        }
      ).sort(compare);
      Vue.set(state.availableSourcesByCorpus, payload.corpus, sources);

    },
    selectInitValues(state, payload) {
      state[payload.pane].selectedCorpus = state.availableCorpora[0];
      state[payload.pane].selectedSubcorpus = state.availableSourcesByCorpus[state[payload.pane].selectedCorpus.id][0];
      state[payload.pane].searchTerm = '';
    },
    changeSelectedCorpus(state, payload) {
      if (payload.corpus) {
        state[payload.pane].selectedCorpus = payload.corpus;
      } else {
        state[payload.pane].selectedCorpus = state.availableCorpora[0];
      }
      state[payload.pane].selectedSubcorpus = state.availableSourcesByCorpus[state[payload.pane].selectedCorpus.id][0];
    },
    changeSelectedParty(state, payload) {
      state[payload.pane].selectedParty = payload.party;
    },
    changeSelectedMetric(state, payload) {
      state[payload.pane].selectedMetric = payload.metric;
    },
    changeAvailableSpeakers(state, payload) {
      state[payload.pane].availableSpeakers = payload.speakers;
    },
    changeSelectedSpeaker(state, payload) {
      state[payload.pane].selectedSpeaker = payload.speaker;
    },
    changeSelectedSubcorpus(state, payload) {
      console.log('changing selected subcorpus');
      state[payload.pane].selectedSubcorpus = payload.subcorpus ? payload.subcorpus : state.availableSourcesByCorpus[state[payload.pane].selectedCorpus.id][0];
      this.commit('main/changeSearchTerm', {
        searchTerm: state[payload.pane].searchTerm,
        pane: payload.pane
      });
    },
    changeSelectedTargetword(state, payload) {
      let selectedYearPayload = {
        pane: payload.pane,
        reset: false
      };
      if (payload.targetword) {
        state[payload.pane].selectedTargetword = payload.targetword;
        state[payload.pane].selectedTargetword.networks.sort((a, b) => a.year - b.year);
      } else {
        state[payload.pane].selectedTargetword = { id: '', text: '' };
        selectedYearPayload.reset = true;
      }
      this.commit('main/changeSelectedYear', selectedYearPayload);
    },
    changeSearchTerm(state, payload) {
      console.log('changing searchterm: ' + payload.searchTerm);
      if (payload.searchTerm) {
        state[payload.pane].searchTerm = payload.searchTerm;
        this.dispatch('main/loadAutocompleteSuggestions', { pane: payload.pane });
      } else {
        state[payload.pane].searchTerm = ''; //state.availableTargetwordsByCorpusAndSource[state[payload.pane].selectedCorpus][state[payload.pane].selectedSubcorpus][0];
      }
    },
    changeSelectedYear(state, payload) {
      if (payload.year) {
        state[payload.pane].selectedYear = payload.year;
      } else if (payload.reset) {
        state[payload.pane].selectedYear = null;
      } else {
        state[payload.pane].selectedYear = state[payload.pane].selectedTargetword.networks[0];
      }
    },
    addSelectedNodeForNodeMetrics(state, payload) {
      state['nodeMetrics'].selectedNodes.push(payload);
    },
    removeSelectedNodeForNodeMetrics(state, payload) {
      let payloadIndex = state['nodeMetrics'].selectedNodes.indexOf(payload);
      state['nodeMetrics'].selectedNodes.splice(payloadIndex, 1);
    },
    addEgoNetwork(state, payload) {
      state[payload['pane']].selectedNetwork = payload.network;
    },
    addGeneralNetwork(state, payload) {
      state[payload['pane']].selectedNetwork = payload.network;
    },
    addGeneralSpeakerNetwork(state, payload) {
      state[payload['pane']].selectedNetwork = payload.network;
    },
    resetSelectedNetwork(state, payload) {
      state[payload['pane']].selectedNetwork = null;
    },
    resetSelectedGeneralNetwork(state, payload) {
      state[payload['pane']].selectedGeneralNetwork = null;
    },
    resetSelectedGeneralSpeakerNetwork(state, payload) {
      state[payload['pane']].selectedGeneralNetwork = null;
    },
    updateEgoNetwork(state, payload) {
      state[payload.pane].selectedNetwork = payload.networkObj;
      logger.log('Updated Ego Network for pane ' + payload.pane);
    },
    updateGeneralNetwork(state, payload) {
      state[payload.pane].selectedNetwork = payload.networkObj;
      logger.log('Updated General Network for pane ' + payload.pane);
    },
    updateGeneralSpeakerNetwork(state, payload) {
      state[payload.pane].selectedNetwork = payload.networkObj;
      logger.log('Updated General Speaker Network for pane ' + payload.pane);
    },
    setAutocompleteSuggestions(state, payload) {
      state[payload.pane].autocompleteSuggestions = payload.suggestions;
    },
    setShowInfo(state, payload) {
      state.showInfo = payload.showInfo;
    },
    addTimeSeriesData(state, payload) {
      state[payload['pane']].timeSeriesData = payload.data;
    },
    addGeneralTimeSeriesData(state, payload) {
      state[payload['pane']].timeSeriesData = payload.data;
    },
    addGeneralSpeakerTimeSeriesData(state, payload) {
      state[payload['pane']].timeSeriesData = payload.data;
    },
    resetTimeSeries(state, payload) {
      state[payload['pane']].timeSeriesData = {};
    },
    addFocusNode(state, payload) {
      state.focusNode = payload.node;
    },
    removeFocusNode(state, payload) {
      if (state.focusNode === payload.node)
        state.focusNode = null;
    }
  },
  getters: {
    focusNode: (state) => {
      return state.focusNode;
    },
    selectionColors: (state) => state.selectionColors,
    availableCorpora: (state) => state.availableCorpora,
    availableSpeakers: (state) => (pane) => state[pane].availableSpeakers,
    selectedParty: (state) => (pane) => state[pane].selectedParty,
    selectedMetric: (state) => (pane) => state[pane].selectedMetric,
    selectedSpeaker: (state) => (pane) => state[pane].selectedSpeaker,
    selectedCorpus: (state) => (pane) => state[pane].selectedCorpus,
    availableSourcesByCorpus: (state) => (selectedCorpus) => state['availableSourcesByCorpus'][selectedCorpus],
    selectedSubcorpus: (state) => (pane) => state[pane].selectedSubcorpus,
    selectedTargetword: (state) => (pane) => state[pane].selectedTargetword,
    selectedNetwork: (state) => (pane) => state[pane].selectedNetwork,
    selectedYear: (state) => (pane) => state[pane].selectedYear,
    searchTerm: (state) => (pane) => state[pane].searchTerm,
    autocompleteSuggestions: (state) => (pane) => state[pane].autocompleteSuggestions,
    getPane: (state) => (pane) => state[pane],
    selectedNodesForMetrics: (state) => state['nodeMetrics'].selectedNodes,
    posColors: (state) => state.posColors,
    labelOptions: (state) => state.labelOptions,
    linkOptions: (state) => state.linkOptions,
    availableParties: (state) => state.availableParties,
    availableMetrics: (state) => state.availableMetrics,
    tableOptions: (state) => state.tableOptions,
    numberOfNetworksVisualised: (state) => {
      let count = 0;
      if (state['pane1'].selectedNetwork) {
        count++;
      }
      if (state['pane2'].selectedNetwork) {
        count++;
      }

      return count;
    },
    secondFormVisibility: (state) => state['topNav'].secondForm,
    timeSeriesData: (state) => (pane) => state[pane].timeSeriesData
  },
  setPosColor({ state }, posTag, colorCode) {
    state.posColors[posTag] = colorCode;
  }
};

const sautoModule = {
  namespaced: true,
  state: {
    connection: null,
    lastOverElement: null,
    sauto: false,
    size: null,
    currentDrag: null
  },
  actions: {
    setBoundingClientRect({ state }, { size }) {
      state.size = size;
    },
    async connect({ state }) {
      if (state.sauto) {
        logger.log(props.sautoURI);
        state.connection = new WebSocket(props.sautoURI);
        state.connection.onerror = function(event) {
          logger.error(event);
        };
        state.connection.onopen = function() {
          logger.log('Connection with Sauto backed established successfully.');
          state.connection.send(
            JSON.stringify({
              appVersion: props.appVersion,
              type: 'VersionInfo'
            })
          );
        };
      }
    },
    agree({ state }, { agreed }) {
      state.sauto = agreed;
      if (agreed) {
        this.dispatch('sauto/connect');
      }
    },
    async handleMouseMove({ state }, { movement }) {
      //send mouse positions
      movement.type = 'MousePosition';
      state.connection.send(JSON.stringify(movement));
    },
    async handleMouseOver({ state }, { mouseOver }) {
      state.connection.send(JSON.stringify(mouseOver));
    },
    async handleKeyPress({ state }, { keyPress }) {
      state.connection.send(JSON.stringify(keyPress));
    },
    async handleResize({ state }, { resized }) {
      if (resized.paneId !== undefined) {
        resized.type = 'Resize';
        state.connection.send(JSON.stringify(resized));
      }
    },
    async handleMouseClick({ state }, { click }) {
      //send mouse click
      click.type = 'MouseClick';
      state.connection.send(JSON.stringify(click));
    },
    async handleDrag({ state }, { drag }) {
      //send mouse drag and drop
      drag.type = 'Drag';
      state.connection.send(JSON.stringify(drag));
    },
    async handleScroll({ state }, { scroll }) {
      //send mouse scroll
      scroll.type = 'Scroll';
      state.connection.send(JSON.stringify(scroll));
    }
  }
};
const store = new Vuex.Store({
  modules: {
    main: mainModule,
    sauto: sautoModule
  }
});

export var mixin = {
  methods: {
    mouseMove(event, sautoId) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }
      if (event.target.nodeType === Node.TEXT_NODE) {
        return;
      }

      const timestamp = Date.now();

      if (sautoId === null || sautoId === undefined) {
        sautoId = this.getNearestSautoId(event.target).getAttribute('data-sauto-id');
      }

      //send if mouseover new component
      if (sautoId !== this.$store.state.lastOverElement) {
        const mouseOver = {
          id: sautoId,
          type: 'MouseOver',
          timestamp: timestamp
        };
        this.$store.state.lastOverElement = sautoId;
        this.$store.dispatch('sauto/handleMouseOver', { mouseOver });
      }

      const movement = this.calculateMousePosition(event);
      movement.timestamp = timestamp;
      this.$store.dispatch('sauto/handleMouseMove', { movement });
    },
    keyPress(event) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }

      //currently im logging only keypress on searchTargetWord input and nothing else, so id is that.
      const keyPress = {
        id: 'selectTargetWord',
        type: 'KeyPress',
        timestamp: Date.now(),
        key: event.key,
        charCode: event.charCode
      };

      this.$store.dispatch('sauto/handleKeyPress', { keyPress });
    },
    resize(paneId) {
      const resized = {
        paneId: paneId
      };
      this.$store.dispatch('sauto/handleResize', { resized });
    },
    scroll(event, sautoId) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }
      const scroll = {
        id: sautoId ? sautoId : this.getNearestSautoId(event.target).getAttribute('data-sauto-id'),
        timestamp: Date.now(),
        height: event.deltaY
      };
      this.$store.dispatch('sauto/handleScroll', { scroll });
    },
    mouseClick(event, sautoId) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }
      const click = this.calculateMousePosition(event);

      click.id = sautoId ? sautoId : this.getNearestSautoId(event.target).getAttribute('data-sauto-id');

      //hacky workaround for double registered clicks
      if (click.id === 'ignore') {
        return;
      }

      click.timestamp = Date.now();

      this.$store.dispatch('sauto/handleMouseClick', { click });
    },
    dragStart(event) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }

      const dragStart = this.calculateMousePosition(event);
      dragStart.timestamp = Date.now();

      this.$store.state.sauto.currentDrag = { start: dragStart };
    },
    dragEnd(event, sautoId) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }
      const dragEnd = this.calculateMousePosition(event);

      dragEnd.timestamp = Date.now();

      let drag = this.$store.state.sauto.currentDrag;
      drag.id = sautoId;
      drag.end = dragEnd;

      this.$store.dispatch('sauto/handleDrag', { drag });
      this.$store.state.sauto.currentDrag = null;
    },
    calculateMousePosition(event) {
      let clientX = event.clientX;
      let clientY = event.clientY;

      //there is a bug with selects which register mouse position as 0,0 when clicked on
      //so i take the element position instead of click position in such cases
      if (clientX === 0 && clientY === 0) {
        const rect = event.target.getBoundingClientRect();
        clientX = rect.x;
        clientY = rect.y;
      }

      //get mouse position in percentage relative to top element size
      const elementSizes = this.$store.state.sauto.size;
      const x = clientX - elementSizes.left;
      const y = clientY - elementSizes.top;

      const positions = {
        x: (x * 100) / elementSizes.width,
        y: (y * 100) / elementSizes.height
      };
      return positions;
    },
    getNearestSautoId(element) {
      if (element.getAttribute('data-sauto-id') === null) {
        // go up in tree until an element with this attribute is found
        while (
          (element = element.parentElement) &&
          !element.getAttribute('data-sauto-id')
          ) ;
      }
      return element;
    }
  }
};

Vue.mixin(mixin);

export default store;
