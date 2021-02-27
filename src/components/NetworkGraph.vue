<template>
  <div class="row">
    <div class="col-md-6" style="height: 600px;" v-for="item in egoNetworks" :key="item.id" @mouseover="mouseOver"
         :data-sauto-id="'network-'+item.id">
      <div class="network-wrapper p-2">
        <h5>{{ item.text }} / {{ item.corpus }} / {{ item.subcorpus }} / {{ item.year }}</h5>
        <h6>Year: {{ item.year }}</h6>
        <d3-network :net-nodes="item.nodes" :net-links="item.links" :options="options"/>
        <div class="row">

          <p class="col-sm-2 text-center">
            <small>
              <b>Available years: </b>
            </small>
          </p>
          <div class="col-sm my-auto year-slider-row">

          <VueSlider
              ref="slider"
              v-model="item.year"
              :min="item.possibleYears[0]"
              :max="item.possibleYears[item.possibleYears.length - 1]"
              :data="item.possibleYears"
              :lazy="true"
              :adsorb="true"
              :duration="0.3"
              v-on:change="updateNetwork(item)"
              :marks="item.possibleYears"
              :tooltip="'none'"
          />
          </div>
        </div>
      </div>

    </div>

  </div>


</template>

<script>

import D3Network from 'vue-d3-network'
import 'vue-range-component/dist/vue-range-slider.css'
//import VueRangeSlider from 'vue-range-component'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'NetworkGraph',
  components: {
    D3Network,
    //VueRangeSlider,
    VueSlider
  },
  props: {},
  data() {
    return {
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
        this.$store.dispatch('main/loadUpdatedEgoNetwork', {network: network});
      }
    },
    saveYear(year) {//save the current year at the start of the drag and if the year is the same at the end, dont send a call
      this.currentYear = year
    }
  },
  computed: {
    egoNetworks() {
      let networks = [];
      for (const network of this.$store.getters["main/egoNetworks"]) {
        let nodes = [];
        let links = [];
        for (const node of network.nodes) {
          nodes.push({
            id: nodes.length,
            name: node.text,
            _size: node.similarity * 40, /* Math.pow(200, node.similarity)*/
            _color: this.chartColors[networks.length][node.clusterId]
          });
        }
        for (const link of network.connections) {
          links.push({
            sid: link.node1,
            tid: link.node2
          });
        }
        networks.push({
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
        })
      }
      return networks;
    },
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
</style>
<style lang="scss">
.year-slider-row {
  font-size: 0.9rem;
  min-height: 90px;
  padding: 10px 15px 0 20px !important;

.vue-slider {
  padding: 3px 7px 5px 5px !important;
  cursor: pointer;

.vue-slider-mark-label {
  transform: rotate(-45deg);
  left: -20px;
}

  }
}
</style>

