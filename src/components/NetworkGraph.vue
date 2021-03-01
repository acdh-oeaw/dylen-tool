<template>
  <div
      v-if="egoNetwork"
      class="row">
    <div
        class="col-md-12"
        style="height: 600px;"
        v-bind="egoNetwork"
        :key="egoNetwork.id"
        @mouseover="mouseOver"
        :data-sauto-id="'network-'+egoNetwork.id">
      <div class="network-wrapper p-2">
        <b-button
            v-b-toggle="'query-collapse-'+pane"
            variant="primary"
            size="sm">
          <span class="when-open">Hide</span>
          <span class="when-closed">New</span>
        </b-button>
        <b-collapse
            v-bind:id="'query-collapse-'+pane"
            class="mt-2">
          <search-form
              :pane="pane"
              :is-sidebar="false">
          </search-form>
        </b-collapse>
        <hr/>
        <h5>
          <div style="text-align: center;">
            {{ egoNetwork.text }} ({{ egoNetwork.corpus }} / {{egoNetwork.subcorpus }})
          </div>
        </h5>
        <div class="p-2">
          <d3-network
              :net-nodes="egoNetwork.nodes"
              :net-links="egoNetwork.links"
              :options="options"/>
        </div>
        <div class="row">
          <p class="col-sm-2 text-center">
            <small>
              <b>Min:</b> {{ egoNetwork.possibleYears[0] }}
            </small>
          </p>
          <div class="col-sm my-auto year-slider-row">

          <VueSlider
              ref="slider"
              v-model="egoNetwork.year"
              v-bind="sliderOptions"
              :min="egoNetwork.possibleYears[0]"
              :max="egoNetwork.possibleYears[egoNetwork.possibleYears.length - 1]"
              :data="egoNetwork.possibleYears"
              :process="false"
              :lazy="true"
              :adsorb="true"
              :duration="0.3"
              v-on:change="updateNetwork(egoNetwork)"
              :marks="egoNetwork.possibleYears"
              :tooltip="'none'"
          />
          </div>
        </div>
      </div>

    </div>

  </div>

  <div v-else class="network-wrapper">
    <div style="text-align: center;">
      Select Parameters and click on the Query button to visualize the Ego-Network
    </div>
    <search-form
        :pane="pane"
        :is-sidebar="false"
        style="padding: 15px;">
    </search-form>
  </div>
</template>

<script>

import D3Network from 'vue-d3-network'
import 'vue-range-component/dist/vue-range-slider.css'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import SearchForm from "@/components/SearchForm";

export default {
  name: 'NetworkGraph',
  components: {
    SearchForm,
    D3Network,
    VueSlider
  },
  props: ['pane'],
  data() {
    return {
      sliderOptions: {
        dotSize: 15,
      },
      options: {
        currentYear: 0,
        force: 750,
        nodeSize: 30,
        nodeLabels: true,
        canvas: false
      },
      chartColors: [
        ['#2b6ca3', '#65add2', '#b0efff'],
        ['#a36c23', '#d59c1e', '#ffd20b']
      ],
    }
  },
  mounted() {
  },
  methods: {
    updateNetwork(network) {
      if (this.currentYear != network.year) {
        //important: the year is already updated in the sent network obj, because v-model is a two way binding on the vue-range-slider
        this.$store.dispatch('main/loadUpdatedEgoNetwork', {network: network, pane: this.pane});
      }
    },
    saveYear(year) {//save the current year at the start of the drag and if the year is the same at the end, dont send a call
      this.currentYear = year
    }
  },
  computed: {
    egoNetwork() {

      const network = this.$store.getters["main/getPane"](this.pane).selectedNetwork
      const nodes = [];
      const links = [];
      let selectedNetwork;

      if (network) {
        for (const node of network.nodes) {
          nodes.push({
            id: nodes.length,
            name: node.text,
            _size: node.similarity * 40, /* Math.pow(200, node.similarity)*/
            _color: this.chartColors[0][node.clusterId]
          });
        }
        for (const link of network.connections) {
          links.push({
            sid: link.node1,
            tid: link.node2
          });
        }
        selectedNetwork = {
          id: network.id,
          nodes: nodes,
          links: links,
          text: network.text,
          year: network.year,
          possibleYears: network.possibleYears,
          threshold: network.threshold,
          corpus: network.corpus,
          subcorpus: network.subcorpus,
          targetWordId: network.targetWordId
        }
        //networks.push(selectedNetwork)
      }

      return selectedNetwork
    }
  },
  watch: {},
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>

<style scoped>
.link {
  stroke: rgb(18 120 98 / 0.15);
}

.node-label {
  font-size: 11px;
}

.network-wrapper {
  border: 1px solid #ccc;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
<style lang="scss">
.year-slider-row {
  font-size: 0.9rem;
  min-height: 50px;
  padding: 10px 50px 0px 10px !important;

  .vue-slider {
    padding: 3px 7px 5px 5px !important;
    cursor: pointer;

    .vue-slider-rail {
      background-color: #b3c1d0;
      border-radius: 25px;
      transition: background-color 0.3s;
    }

    .vue-slider-mark-label {
      transform: rotate(-45deg);
      left: -20px;
    }

  }
}
</style>

