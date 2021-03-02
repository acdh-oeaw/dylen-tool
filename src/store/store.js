import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import props from "../properties/propertiesLoader";

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.prototype.$properties = props; //to be able to access in modules

Vue.use(Vuex);

const graphqlEndpoint = props.graphqlEndpoint;

const logger = require("../helpers/logger");

const mainModule = {
  namespaced: true,
  state: {
    availableQueryParams: [],
    selectedCorpus: { id: "", name: "", sources: [] },
    selectedSubcorpus: { id: "", name: "", targetWords: [] },
    selectedTargetword: { id: "", text: "" },
    selectedYear: null,
    egoNetworks: [],
  },
  mutations: {
    changeSelectedCorpus(state, corpus) {
      if (corpus) {
        state.selectedCorpus = corpus;
      } else {
        state.selectedCorpus = state.availableQueryParams[0];
      }
      this.commit("main/changeSelectedSubcorpus", false);
    },
    changeSelectedSubcorpus(state, subcorpus) {
      if (subcorpus) {
        state.selectedSubcorpus = subcorpus;
      } else {
        state.selectedSubcorpus = state.selectedCorpus.sources[0];
      }
      this.commit("main/changeSelectedTargetword", false);
    },
    changeSelectedTargetword(state, targetword) {
      if (targetword) {
        state.selectedTargetword = targetword;
      } else {
        state.selectedTargetword = state.selectedSubcorpus.targetWords[0];
      }
      this.commit("main/changeSelectedYear", false);
    },
    changeSelectedYear(state, year) {
      if (year) {
        state.selectedYear = year;
      } else {
        state.selectedYear = state.selectedTargetword.networks[0];
      }
    },
    addEgoNetwork(state, networkObj) {
      state.egoNetworks.push(networkObj);
    },
    removeEgoNetwork(state, networkID) {
      const selectedNetworkIndex = state.egoNetworks.findIndex((obj) => {
        return obj.id === networkID;
      });

      state.egoNetworks.splice(selectedNetworkIndex, 1);
    },
    updateEgoNetwork(state, { networkID, networkObj }) {
      const selectedNetworkIndex = state.egoNetworks.findIndex((obj) => {
        return obj.id === networkID;
      });

      state.egoNetworks.splice(selectedNetworkIndex, 1, networkObj);
    },
  },
  getters: {
    availableQueryParams: (state) => state.availableQueryParams,
    selectedCorpus: (state) => state.selectedCorpus,
    selectedSubcorpus: (state) => state.selectedSubcorpus,
    selectedTargetword: (state) => state.selectedTargetword,
    selectedYear: (state) => state.selectedYear,
    egoNetworks: (state) => state.egoNetworks,
  },
  actions: {
    async loadAvailableQueryParams({ state }) {
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
                    year
                  }
                }
              }
            }
          }`,
        };
        const response = await axios.post(graphqlEndpoint, graphqlQuery);
        state.availableQueryParams = response.data.data.allAvailableCorpora;
        state.selectedCorpus = response.data.data.allAvailableCorpora[0];
        state.selectedSubcorpus =
          response.data.data.allAvailableCorpora[0].sources[0];
        state.selectedTargetword =
          response.data.data.allAvailableCorpora[0].sources[0].targetWords[0];
        state.selectedYear =
          response.data.data.allAvailableCorpora[0].sources[0].targetWords[0].networks[0];
        logger.log("Query parameters loaded successfully.");
      } catch (error) {
        logger.error(error);
      }
    },
    async loadEgoNetwork({ state }) {
      let year_param = state.selectedYear
        ? state.selectedYear.year
        : state.selectedTargetword.networks[0].year;

      try {
        const graphqlQuery = {
          query: `{
            getNetwork(targetword_id: "${state.selectedTargetword.id}", year:${year_param}){
                year
                nodes {
                    id
                    clusterId
                    text
                    pos
                    similarity
                    metrics {
                      degreeCentrality
                      closenessCentrality
                      betweennessCentrality
                      eigenvectorCentrality
                    }
                }
                connections {
                    node1
                    node2
                    similarity
                }
            }
          }`,
        };
        const response = await axios.post(
          "https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql",
          graphqlQuery
        );
        const networkID = state.selectedTargetword.id + state.selectedYear.year;
        let network = response.data.data.getNetwork;
        network.id = networkID;
        network.targetWordId = state.selectedTargetword.id;
        network.corpus = state.selectedCorpus.name;
        network.subcorpus = state.selectedSubcorpus.name;
        network.text = state.selectedTargetword.text;
        network.possibleYears = state.selectedTargetword.networks.map(
          (n) => n.year
        );
        logger.log("Ego Network loaded successfully.");
        this.commit("main/addEgoNetwork", network);
      } catch (error) {
        logger.error(error);
      }
    },
    async loadUpdatedEgoNetwork(state, { network: oldNetwork }) {
      try {
        const graphqlQuery = {
          query: `{
            getNetwork(targetword_id: "${oldNetwork.targetWordId}", year:${oldNetwork.year}){
                year
                nodes {
                    id
                    clusterId
                    text
                    pos
                    similarity
                    metrics {
                      degreeCentrality
                      closenessCentrality
                      betweennessCentrality
                      eigenvectorCentrality
                    }
                }
                connections {
                    node1
                    node2
                    similarity
                }
            }
          }`,
        };
        const response = await axios.post(
          "https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql",
          graphqlQuery
        );
        const networkID = oldNetwork.targetWordId + oldNetwork.year;
        let updatedNetwork = response.data.data.getNetwork;
        updatedNetwork.id = networkID;
        updatedNetwork.targetWordId = oldNetwork.targetWordId;
        updatedNetwork.corpus = oldNetwork.corpus;
        updatedNetwork.subcorpus = oldNetwork.subcorpus;
        updatedNetwork.text = oldNetwork.text;
        updatedNetwork.possibleYears = oldNetwork.possibleYears;
        logger.log("Ego Network %s updated successfully.", networkID);
        this.commit("main/updateEgoNetwork", {
          networkID: oldNetwork.id,
          networkObj: updatedNetwork,
        });
      } catch (error) {
        logger.error(error);
      }
    },
  },
};

const sautoModule = {
  namespaced: true,
  state: {
    connection: null,
    lastOverElement: null,
    sauto: false,
  },
  actions: {
    async connect({ state }) {
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
    agree({ state }, { agreed }) {
      state.sauto = agreed;
      if (agreed) {
        this.dispatch("sauto/connect");
      }
    },
    async handleMouseMove({ state }, { movement }) {
      //send mouse positions
      movement.type = "MousePosition";
      state.connection.send(JSON.stringify(movement));
    },
    async handleMouseOver({ state }, { mouseOver }) {
      //send if mouseover new component
      if (mouseOver.id !== null) {
        if (mouseOver.id !== state.lastOverElement) {
          mouseOver.type = "MouseOver";
          state.connection.send(JSON.stringify(mouseOver));
          state.lastOverElement = mouseOver.id;
        }
      }
    },
    async handleMouseClick({ state }, { click }) {
      //send mouse click
      click.type = "MouseClick";
      state.connection.send(JSON.stringify(click));
    },
    async handleScroll({ state }, { scroll }) {
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
      this.$store.dispatch("sauto/handleMouseOver", { mouseOver });
    },
    mouseMove(event) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }

      const movement = this.calculateMousePosition(event);
      this.$store.dispatch("sauto/handleMouseMove", { movement });
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

      this.$store.dispatch("sauto/handleScroll", { scroll });
    },
    mouseClick(event) {
      if (this.$store.state.sauto.sauto === false) {
        return;
      }
      const click = this.calculateMousePosition(event);

      const element = this.getNearestSautoId(event.target);

      click.id = element.getAttribute("data-sauto-id");
      click.timestamp = Date.now();

      this.$store.dispatch("sauto/handleMouseClick", { click });
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
        );
      }
      return element;
    },
  },
});

export default store;
