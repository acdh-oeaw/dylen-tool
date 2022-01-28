import Vue from 'vue';
import Vuex from 'vuex';
import VueCompositionAPI from '@vue/composition-api';

import { BSpinner } from 'bootstrap-vue';
import axios from 'axios';
import {
  corpusNameMapping,
  filterBasedOnSlider,
  getKeyByValue,
  partyMapping,
  sourceNameMapping
} from '@/helpers/mappers';
import props from '../properties/propertiesLoader';
import {
  allAvailableCorporaQuery,
  getAutocompleteSuggestionsQuery,
  getAvailablePartiesQuery,
  getAvailableYearsForParty,
  getGeneralNetworkQuery,
  getGeneralSpeakerNetworkQuery,
  getMetadataSpeaker,
  getNetworkQuery,
  getSourcesByCorpusQuery,
  getSpeakersForParty,
  getTargetWordByIdQuery
} from '@/queries/queries';
import { ExportToCsv } from 'export-to-csv';
import { speakers_not_fount } from '@/helpers/speakers_not_found';
import { getEgoNetworkTimeSeries, getGeneralTimeSeries } from '@/helpers/api_client';
import { compare } from '@/helpers/utils';
import { GENERAL_PARTY } from '@/helpers/mixins';
import { NETWORK_SIZE_OK, NETWORK_SIZE_SHOW_WARNING } from '@/helpers/mixins';
import {sauto_mixin, sautoModule} from '@/store/sauto';

Vue.component('b-spinner', BSpinner);

Vue.prototype.axios = axios;
Vue.use(Vuex);
Vue.use(VueCompositionAPI);

const graphqlEndpoint = props.graphqlEndpoint;
const logger = require('../helpers/logger');

logger.log(graphqlEndpoint);


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

//TODO Split up this module into smaller submodules
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
    async initParties({ dispatch }) {
      const response = await axios.post(graphqlEndpoint, getAvailablePartiesQuery);
      const partyPayload = {
        parties: response.data.data.parties
      };
      this.commit('main/loadParties', partyPayload);
      await dispatch('loadSources');
    },
    async speakersForParty(state, payload) {
      if (payload.party) {
        let party = partyMapping[payload.party];

        const response = await axios.post(graphqlEndpoint, getSpeakersForParty(party));
        const speakerResponse = response.data.data.findSpeakerByParty;
        let not_found = speakers_not_fount[party];

        let speakers = speakerResponse.speakers.filter(s => !not_found.includes(s));
        this.commit('main/changeAvailableSpeakers', { speakers: speakers.sort(), pane: payload.pane });
      }
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
      this.commit('main/selectInitValues', { pane: 'pane1' });
      this.commit('main/selectInitValues', { pane: 'pane2' });

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
    async loadAvailableSpeakers({ dispatch }, payload) {
      try {
        await dispatch('speakersForParty', payload);
        logger.log('Query parameters loaded successfully.');
      } catch (error) {
        logger.error(error);
      }
    },
    async resetSelectedNetwork({ state }, { pane: pane }) {
      if (state[pane].selectedNetwork) {
        state[pane].selectedNetwork.nodes
          .filter((node) =>
            state['nodeMetrics'].selectedNodes.find(
              (n) => n.id === node.id && n._pane === node._pane
            )
          )
          .forEach((node) => {
            this.commit('main/removeSelectedNodeForNodeMetrics', node);
          });
      }
      state[pane].selectedNetwork = null;
    },
    async loadGeneralNetwork({ state, commit }, {
      pane: pane,
      party: party_orig,
      sliderMin: slidValMin,
      sliderMax: slidValMax
    }) {
      function assignValuesFromState(network, networkID, years) {
        network.id = networkID;
        network.filter = {
          metric: state[pane].generalNetwork.selectedMetric,
          valueMin: slidValMin,
          valueMax: slidValMax
        };
        network.party = getKeyByValue(partyMapping, party);
        network.possibleYears = years.map(Number).sort();
        network.year = Math.max(...years.map(Number));
        network.type = 'Party';
      }

      let party = partyMapping[party_orig];

      try {
        state[pane].busy = true;
        const availableYearsQuery = getAvailableYearsForParty(party);
        const yearsResponse = await axios.post(graphqlEndpoint, availableYearsQuery);
        let years = yearsResponse.data.data['getAvailableYearsForParty']['available_years'];
        let year = Math.max(...years);

        const query = getGeneralNetworkQuery(party, year);
        const response = await axios.post(graphqlEndpoint, query);
        const networkID = party + '_' + year;

        let network = response.data.data.getGeneralSourceByPartyYear.networks;

        network.nodes.forEach(node => node['normalisedFrequency'] = node.normalised_frequency);
        network.nodes.forEach(node => node['absoluteFrequency'] = node.absolute_frequency);
        network.nodes.forEach(node => node.metrics['normalisedFrequency'] = node.normalisedFrequency);
        network.nodes.forEach(node => node.metrics['absoluteFrequency'] = node.absoluteFrequency);

        assignValuesFromState(network, networkID, years);
        filterBasedOnSlider(network);

        if (network.nodes.length > 1000 || network.edges.length > 1000)
          state[pane].timeoutWarning = NETWORK_SIZE_SHOW_WARNING;
        else
          state[pane].timeoutWarning = NETWORK_SIZE_OK;

        state[pane].noEdgesInNetwork = network.edges.length === 0

        const payload = {
          pane: pane,
          network: network
        };

        commit('addGeneralNetwork', payload);
        state[pane].busy = false;
        logger.log('General Network loaded successfully.');
      } catch (error) {
        logger.error(error);
        state[pane].busy = false;
      }
    },
    async loadGeneralSpeakerNetwork({ state }, { pane: pane, sliderMin: slidValMin, sliderMax: slidValMax }) {
      function assignValuesFromState(network, networkID, possibleYears) {
        network.id = networkID;
        network.speaker = state[pane].generalNetworkSpeaker.form.selectedSpeaker;
        network.party = partyMapping[state[pane].generalNetworkSpeaker.form.selectedParty];
        network.possibleYears = possibleYears.map(Number).sort();
        network.filter = {
          metric: state[pane].generalNetworkSpeaker.form.selectedMetric,
          valueMin: slidValMin,
          valueMax: slidValMax
        };
        network.year = Math.max(...possibleYears.map(Number));
        network.type = 'Speaker';
      }

      let speaker = state[pane].generalNetworkSpeaker.form.selectedSpeaker;

      try {
        state[pane].busy = true;

        const yearResponse = await axios.post(graphqlEndpoint, getMetadataSpeaker(speaker));
        let possibleYears = yearResponse.data.data.getAvailableYearsForSpeaker.available_years.sort();
        let maxYear = Math.max(...possibleYears.map(Number));

        const query = getGeneralSpeakerNetworkQuery(speaker);
        const response = await axios.post(graphqlEndpoint, query);

        let network = response.data.data.getGeneralSourceBySpeakerYear.networks.find(nw => nw.year === maxYear.toString());

        const networkID = speaker + '_' + maxYear;
        assignValuesFromState(network, networkID, possibleYears);
        network.nodes.forEach(node => node['normalisedFrequency'] = node.normalised_frequency);
        network.nodes.forEach(node => node['absoluteFrequency'] = node.absolute_frequency);
        network.nodes.forEach(node => node.metrics['normalisedFrequency'] = node.normalisedFrequency);
        network.nodes.forEach(node => node.metrics['absoluteFrequency'] = node.absoluteFrequency);
        filterBasedOnSlider(network);

        if (network.nodes.length > 1000 || network.edges.length > 1000)
          state[pane].timeoutWarning = NETWORK_SIZE_SHOW_WARNING;
        else
          state[pane].timeoutWarning = NETWORK_SIZE_OK;

          if (network.edges.length === 0)
          state[pane].noEdgesInNetwork = true;
          else
          state[pane].noEdgesInNetwork = false;

        const payload = {
          pane: pane,
          network: network
        };

        this.commit('main/addGeneralSpeakerNetwork', payload);
        state[pane].busy = false;

        logger.log('General Speaker Network loaded successfully.');
      } catch (error) {
        state[pane].busy = false;

        logger.error(error);
      }
    },
    async loadEgoNetwork({ state, dispatch }, pane) {
      function assignValuesFromState(network, networkID) {
        network.id = networkID;
        network.targetWordId = state[pane].selectedTargetword.id;
        network.corpus = state[pane].selectedCorpus;
        network.subcorpus = state[pane].selectedSubcorpus;
        network.text = state[pane].selectedTargetword.text;
        network.possibleYears = state[pane].selectedTargetword.networks.map(n => n.year).sort();
        network.pos = state[pane].selectedTargetword.pos;
        //TODO: use constant.. hardcoding types as string is very errorprone
        network.type = 'Ego';
      }

      state[pane].busy = true;

      if (!(state[pane].selectedTargetword && state[pane].selectedTargetword.id)) {
        let response = await dispatch('loadTargetwordBySearchTerm', {
          pane: pane,
          searchTerm: state[pane].autocompleteSuggestions[0]
        });
        state[pane].selectedTargetword = response.data.data.getTargetWordById;
        console.log(state[pane].selectedTargetword);
      }
      let year_param = state[pane].selectedYear ? state[pane].selectedYear.year : state[pane].selectedTargetword.networks[0].year;

      try {
        const response = await axios.post(graphqlEndpoint,
          getNetworkQuery(state[pane].selectedTargetword.id, year_param));
        const networkID = state[pane].selectedTargetword.id + state[pane].selectedYear.year;
        let network = response.data.data.getNetwork;
        network.nodes.forEach(node => node.metrics['normalisedFrequency'] = node.normalisedFrequency);
        network.nodes.forEach(node => node.metrics['absoluteFrequency'] = node.absoluteFrequency);
        assignValuesFromState(network, networkID);

        const payload = {
          pane: pane,
          network: network
        };

        this.commit('main/addEgoNetwork', payload);
        logger.log('Ego Network loaded successfully.');
        state[pane].busy = false;
      } catch (error) {
        //TODO use alert
        logger.error(error);
        state[pane].busy = false;
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
        updatedNetwork.nodes.forEach(node => node.metrics['normalisedFrequency'] = node.normalisedFrequency);
        updatedNetwork.nodes.forEach(node => node.metrics['absoluteFrequency'] = node.absoluteFrequency);
        logger.log('Ego Network %s updated successfully.', networkID);

        this.commit('main/updateEgoNetwork', { networkObj: updatedNetwork, pane: pane });
        this.commit('main/changeSelectedYear', { pane: pane, year: updatedNetwork });
      } catch (error) {
        logger.error(error);
      }
    },
    async loadUpdatedGeneralNetwork({ state }, { network: oldNetwork, pane: pane }) {
      try {
        let response = await axios.post(graphqlEndpoint,
          getGeneralNetworkQuery(partyMapping[oldNetwork.party], oldNetwork.year));
        let networkID = oldNetwork.party + '_' + oldNetwork.year;
        let updatedNetwork = response.data.data.getGeneralSourceByPartyYear.networks;

        updatedNetwork.party = oldNetwork.party;
        updatedNetwork.filter = oldNetwork.filter;
        updatedNetwork.id = networkID;
        updatedNetwork.possibleYears = oldNetwork.possibleYears;
        updatedNetwork.year = oldNetwork.year;
        updatedNetwork.type = oldNetwork.type;
        updatedNetwork.nodes.forEach(node => node['normalisedFrequency'] = node.normalised_frequency);
        updatedNetwork.nodes.forEach(node => node['absoluteFrequency'] = node.absolute_frequency);
        updatedNetwork.nodes.forEach(node => node.metrics['normalisedFrequency'] = node.normalisedFrequency);
        updatedNetwork.nodes.forEach(node => node.metrics['absoluteFrequency'] = node.absoluteFrequency);

        filterBasedOnSlider(updatedNetwork);
        console.log(state, pane, state[pane]);
        if (updatedNetwork.nodes.length > 1000 || updatedNetwork.edges.length > 1000)
          state[pane].timeoutWarning = NETWORK_SIZE_SHOW_WARNING;
        else
          state[pane].timeoutWarning = NETWORK_SIZE_OK;

          if (updatedNetwork.edges.length === 0)
          state[pane].noEdgesInNetwork = true;
          else
          state[pane].noEdgesInNetwork = false;

        logger.log('Network %s updated successfully.', networkID);

        this.commit('main/updateGeneralNetwork', { networkObj: updatedNetwork, pane: pane });
        this.commit('main/changeSelectedYear', { pane: pane, year: updatedNetwork });
      } catch (error) {
        logger.error(error);
      }
    },
    async resetGeneralNetwork(state, payload) {
      this.commit('main/resetTimeSeries', payload);
      this.dispatch('main/resetSelectedNetwork', payload);
    },
    async resetGeneralNetworkSpeaker(state, payload) {
      this.commit('main/changeSelectedSpeakerMetric', payload);
      this.commit('main/resetTimeSeries', payload);
      this.dispatch('main/resetSelectedNetwork', payload);
      this.commit('main/setSelectedSpeakerParty', payload);
      this.dispatch('main/loadAvailableSpeakers', payload);
    },
    async loadUpdatedSpeakerNetwork({ state }, { network: oldNetwork, pane: pane }) {
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
        updatedNetwork.nodes.forEach(node => node['normalisedFrequency'] = node.normalised_frequency);
        updatedNetwork.nodes.forEach(node => node['absoluteFrequency'] = node.absolute_frequency);
        updatedNetwork.nodes.forEach(node => node.metrics['normalisedFrequency'] = node.normalisedFrequency);
        updatedNetwork.nodes.forEach(node => node.metrics['absoluteFrequency'] = node.absoluteFrequency);
        filterBasedOnSlider(updatedNetwork);

        if (updatedNetwork.nodes.length > 1000 || updatedNetwork.edges.length > 1000)
          state[pane].timeoutWarning = NETWORK_SIZE_SHOW_WARNING;
        else
          state[pane].timeoutWarning = NETWORK_SIZE_OK;

          if (updatedNetwork.edges.length === 0)
          state[pane].noEdgesInNetwork = true;
          else
          state[pane].noEdgesInNetwork = false;

        logger.log('General Network %s updated successfully.', networkID);

        this.commit('main/addGeneralSpeakerNetwork', { network: updatedNetwork, pane: pane });
        this.commit('main/changeSelectedYear', { pane: pane, year: updatedNetwork });
      } catch (error) {
        logger.error(error);
      }
    },
    async changeSelectedSpeakerParty(state, payload) {
      this.commit('main/setSelectedSpeakerParty', payload);
      this.dispatch('main/loadAvailableSpeakers', payload);
    },
    async loadAutocompleteSuggestions({ state }, { pane, searchTerm, commit }) {
      let oldSearchTerm = state[pane].searchTerm;
      let oldSuggestions = state[pane].autocompleteSuggestions;
      if (searchTerm)
        state[pane].searchTerm = searchTerm;
      const suggestionsResponse = await axios.post(graphqlEndpoint,
        getAutocompleteSuggestionsQuery(state[pane].selectedCorpus.id, state[pane].selectedSubcorpus.id, state[pane].searchTerm));
      this.commit('main/setAutocompleteSuggestions', {
        suggestions: suggestionsResponse.data.data.getAutocompleteSuggestions,
        pane: pane
      });
      if (commit) {
        let matchingSuggestion = state[pane].autocompleteSuggestions.find(s => s.text == state[pane].searchTerm);
        if (state[pane].autocompleteSuggestions.length === 0 || !matchingSuggestion) {
          state[pane].searchTerm = oldSearchTerm;
          state[pane].autocompleteSuggestions = oldSuggestions;
          state.targetWordNotFound = true;
        } else {
          let response = await this.dispatch('main/loadTargetwordBySearchTerm', {
            pane: pane,
            searchTerm: matchingSuggestion
          });
          state[pane].selectedTargetword = response.data.data.getTargetWordById;
          await Promise.all([this.dispatch('main/loadEgoNetwork', pane), this.dispatch('main/loadTimeSeriesData', pane)]);
        }
      }
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
      this.commit('main/changeSelectedTargetword', {
        pane: payload.pane,
        targetword: response.data.data.getTargetWordById
      });

      return response;
    },
    async loadGeneralTimeSeriesData(state, { pane, type, entity }) {
      try {
        let data = await getGeneralTimeSeries(type, entity);

        const payload = { pane: pane, data: data };
        type === GENERAL_PARTY ? this.commit('main/addGeneralTimeSeriesData', payload) : this.commit('main/addGeneralSpeakerTimeSeriesData', payload);

        logger.log('General Network loaded successfully.');
      } catch (error) {
        logger.error(error);
      }
    },
    async loadTimeSeriesData({ state }, pane) {
      try {
        if (!(state[pane].selectedTargetword && state[pane].selectedTargetword.id))
          state[pane].selectedTargetword = state[pane].autocompleteSuggestions[0];
        let data = await getEgoNetworkTimeSeries(state, pane);
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
    settings: {
      active: false,
      component: null
    },
    selectionColors: ['#1E88E5', '#D81B60'],
    availableCorpora: [],
    availableSourcesByCorpus: {},
    availableTargetwordsByCorpusAndSource: {},
    topNav: {
      networkType: null,
      secondForm: false
    },
    focusNode: null,
    targetWordNotFound: false,
    pane1: {
      availableSpeakers: [],
      selectedCorpus: { id: '', name: '', sources: [] },
      generalNetwork: { selectedParty: { party: '' }, selectedMetric: { metric: '' } },
      generalNetworkSpeaker: {
        form: {
          selectedParty: '',
          selectedMetric: { metric: '' },
          selectedSpeaker: { speaker: '' }
        },
        network: null,
        year: null,
        loaded: false
      },
      selectedSubcorpus: { id: '', name: '', targetWords: [] },
      selectedTargetword: { id: '', text: '' },
      selectedYear: null,
      selectedNetwork: null,
      searchTerm: null,
      autocompleteSuggestions: [],
      timeSeriesData: {},
      busy: false,
      errors: [],
      timeoutWarning: NETWORK_SIZE_OK,
      noEdgesInNetwork: false
    },
    pane2: {
      availableSpeakers: [],
      selectedCorpus: { id: '', name: '', sources: [] },
      generalNetwork: { selectedParty: { party: '' }, selectedMetric: { metric: '' } },
      generalNetworkSpeaker: {
        form: {
          selectedParty: '',
          selectedMetric: { metric: '' },
          selectedSpeaker: { speaker: '' }
        },
        network: null,
        year: null,
        loaded: false
      },
      selectedMetric: { metric: '' },
      selectedParty: { party: '' },
      selectedSpeaker: { speaker: '' },
      selectedSubcorpus: { id: '', name: '', targetWords: [] },
      selectedTargetword: { id: '', text: '' },
      selectedYear: null,
      selectedNetwork: null,
      searchTerm: null,
      autocompleteSuggestions: [],
      timeSeriesData: {},
      busy: false,
      errors: [],
      timeoutWarning: NETWORK_SIZE_OK,
      noEdgesInNetwork: false
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
    showInfoButton: false,
    availableMetrics: ['Degree Centrality', 'Eigenvector Centrality', 'Closeness Centrality', 'Betweenness Centrality',
      'Pagerank', 'Load Centrality', 'Harmonic Centrality', 'Clustering Coefficient'],
    availableParties: ['SPÖ', 'STRONACH', 'FPÖ', 'GRÜNE', 'ÖVP', 'BZÖ', 'NEOS'],
    parallelCoordinateMetrics: [
      { name: 'normalisedFrequency', enabled: true },
      { name: 'degreeCentrality', enabled: true },
      { name: 'betweennessCentrality', enabled: true },
      { name: 'pagerank', enabled: true },
      { name: 'clusteringCoefficient', enabled: true },
      { name: 'closenessCentrality', enabled: false },
      { name: 'eigenvectorCentrality', enabled: false },
      { name: 'loadCentrality', enabled: false },
      { name: 'harmonicCentrality', enabled: false },
      { name: 'absoluteFrequency', enabled: false }

    ]
  },
  mutations: {
    changeActiveSettings(state, payload) {
      let component = (state.settings.component === payload.component) ? 'closed' : payload.component;
      state.settings.active = component !== 'closed';
      state.settings.component = component;
    },
    changeTopNavType(state, payload) {
      state.topNav.networkType = payload['networkType'];
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
          };
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
      state[payload.pane].generalNetwork.selectedParty = payload.party;
    },
    changeSelectedMetric(state, payload) {
      console.log('setting selected metic to: ' + payload.metric);
      state[payload.pane].generalNetwork.selectedMetric = payload.metric;
    },
    changeAvailableSpeakers(state, payload) {
      //TODO group this with other generalnetworkspeaker states
      state[payload.pane].availableSpeakers = payload.speakers;
    },
    setSelectedSpeakerParty(state, payload) {
      state[payload.pane].generalNetworkSpeaker.form.selectedParty = payload.party;
      state[payload.pane].generalNetworkSpeaker.loaded = false;
    },
    changeSelectedSpeakerMetric(state, payload) {
      state[payload.pane].generalNetworkSpeaker.form.selectedMetric = payload.metric;
    },
    changeSelectedSpeaker(state, payload) {
      state[payload.pane].generalNetworkSpeaker.form.selectedSpeaker = payload.speaker;
      state[payload.pane].generalNetworkSpeaker.loaded = false;
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
    addError(state, payload) {
      state[payload.pane].errors.push(payload.error);
    },
    resetError(state, payload) {
      state[payload.pane].errors = [];
    },
    changeSearchTerm(state, payload) {
      console.log('changing searchterm: ' + payload.searchTerm);
      if (payload.searchTerm) {
        state[payload.pane].searchTerm = payload.searchTerm;
        if (state[payload.pane].searchTerm.toLowerCase() !== state[payload.pane].selectedTargetword.text.toLowerCase()) {
          this.dispatch('main/loadAutocompleteSuggestions', { pane: payload.pane });
        }
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
    removeAllSelectedNodes(state) {
      state['nodeMetrics'].selectedNodes = [];
    },
    addEgoNetwork(state, payload) {
      state[payload['pane']].selectedNetwork = payload.network;
    },
    addGeneralNetwork(state, payload) {
      state[payload['pane']].selectedNetwork = payload.network;
      state[payload['pane']].generalNetwork.selectedParty = payload.network.party;
    },
    addGeneralSpeakerNetwork(state, payload) {
      state[payload['pane']].selectedNetwork = payload.network;
      state[payload['pane']].generalNetworkSpeaker.network = payload.network;
      state[payload['pane']].generalNetworkSpeaker.form.selectedYear = payload.network.year;
      state[payload['pane']].generalNetworkSpeaker.loaded = true;
    },
    resetGeneralSpeakerNetwork(state, payload) {
      state[payload['pane']].generalNetworkSpeaker.selectedParty = '';
      state[payload['pane']].generalNetworkSpeaker.selectedMetric = '';
    },
    updateEgoNetwork(state, payload) {
      state[payload.pane].selectedNetwork = payload.networkObj;
      logger.log('Updated Ego Network for pane ' + payload.pane);
    },
    updateGeneralNetwork(state, payload) {
      state[payload.pane].selectedNetwork = payload.networkObj;
      logger.log('Updated General Network for pane ' + payload.pane);
    },
    setAutocompleteSuggestions(state, payload) {
      console.log('setting autocomplete');
      state[payload.pane].autocompleteSuggestions = payload.suggestions.sort((a, b) => a.text.localeCompare(b.text));
      console.log('autosuggestions: ' + state[payload.pane].autocompleteSuggestions);
      if (state[payload.pane].autocompleteSuggestions.length === 0 && state[payload.pane].searchTerm) {
        console.log('not found');
        this.commit('main/addError', {
          error: 'Keyword not found',
          pane: payload.pane
        });
      }
    },
    setShowInfo(state, payload) {
      console.log('setting showinfo button: ' + payload.showInfo);
      state.showInfo = payload.showInfo;
    },
    setShowInfoButton(state, payload) {
      state.showInfoButton = payload.showInfoButton;
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
    },
    setBusyState(state, payload) {
      state[payload.pane].busy = payload.busy;
    },
    setParallelCoordinateMetrics(state, payload) {
      logger.log('payload', payload);
      state.parallelCoordinateMetrics = payload;
    },
    setTargetWordNotFound(state, value) {
      state.targetWordNotFound = value;
    },
    setTimeoutWarning(state, { pane, value }) {
      state[pane].timeoutWarning = value;
    },
    setNoEdgesInNetwork(state, { pane, value }) {
      state[pane].noEdgesInNetwork = value;
    },
  },
  getters: {
    focusNode: (state) => {
      return state.focusNode;
    },
    selectionColors: (state) => state.selectionColors,
    availableCorpora: (state) => state.availableCorpora,
    availableSpeakers: (state) => (pane) => state[pane].availableSpeakers,
    selectedGeneralNetworkParty: (state) => (pane) => state[pane].selectedNetwork,
    selectedGeneralNetworkMetric: (state) => (pane) => state[pane].generalNetwork.selectedMetric,
    selectedGeneralNetworkSpeakerParty: (state) => (pane) => state[pane].generalNetworkSpeaker.form.selectedParty,
    selectedGeneralNetworkSpeakerMetric: (state) => (pane) => state[pane].generalNetworkSpeaker.form.selectedMetric,
    selectedGeneralNetworkSpeakerSpeaker: (state) => (pane) => state[pane].generalNetworkSpeaker.form.selectedSpeaker,
    selectedGeneralNetworkSpeaker: (state) => (pane) => state[pane].generalNetworkSpeaker,
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
    topNav: (state) => state.topNav,
    availableParties: (state) => state.availableParties,
    availableMetrics: (state) => state.availableMetrics,
    tableOptions: (state) => state.tableOptions,
    settingsActive: (state) => state.settings.active,
    activeSettings: (state) => state.settings.component,
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
    showInfoButton: (state) => state.showInfoButton,
    timeSeriesData: (state) => (pane) => state[pane].timeSeriesData,
    busyState: state => pane => state[pane].busy,
    parallelCoordinateMetrics: state => state.parallelCoordinateMetrics,
    targetWordNotFound: state => state.targetWordNotFound,
    timeoutWarning: state => pane => state[pane].timeoutWarning,
    noEdgesInNetwork: state => pane => state[pane].noEdgesInNetwork
  }
};

const store = new Vuex.Store({
  modules: {
    main: mainModule,
    sauto: sautoModule
  }
});

Vue.mixin(sauto_mixin);

export default store;
