<template>
  <b-container
    ref='con'
    fluid
    class='mt-2'
    style='background-color: white'
    v-if='generalNetwork'
  >
    <b-overlay
      :show="isNetworkLoading"
      rounded="sm"
    >
      <b-row class='h-10'>
        <b-col>
          <span><b>{{ generalNetwork.party }}</b></span>
        </b-col>
      </b-row>
      <b-row class='h-20 pb-2'>
        <!--      <b-col xl='2'></b-col>-->
        <b-col
          class='pl-5 year-slider-row'
          data-sauto-id='ignore'
        >
          <div
            ref='sliderDiv'
            class='pl-2'
          >
            <vue-slider
              ref='slider'
              v-model='generalNetwork.year'
              v-bind='sliderOptions'
              :min='generalNetwork.possibleYears[0]'
              :max='generalNetwork.possibleYears[generalNetwork.possibleYears.length - 1]'
              :data='generalNetwork.possibleYears'
              :process='false'
              :lazy='true'
              :adsorb='true'
              :duration='0.3'
              v-on:change='handleYearChange'
              :marks='generalNetwork.possibleYears'
              :tooltip="'none'"
            />
          </div>
        </b-col>
      </b-row>
      <b-row
        lg='12'
        class='pt-2 h-70'
        v-bind='generalNetwork'
        :key='generalNetwork.id'
        data-sauto-id='ignore'
      >
        <b-col>
          <div>
            <d3-network
              ref='egoChart'
              class='network-wrapper'
              :net-nodes='generalNetwork.nodes'
              :net-links='generalNetwork.links'
              :options='options'
              :pane='this.pane'
            />
          </div>
        </b-col>
      </b-row>
    </b-overlay>

  </b-container>
</template>
<!--v-on:change='updateNetwork(generalNetwork)'-->
<script>
import D3Network from './D3Network';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import { snakeToCamel } from '@/helpers/utils';

export default {
  name: 'NetworkGraphGeneral',
  components: {
    D3Network,
    VueSlider
  },
  props: ['pane'],
  data() {
    return {
      options: {
        /* force: 100, */
        nodeSize: 10,
        nodeDistance: 75,
        nodeLabels: true,
        boundingBox: false, //Indicates whether nodes are forces to be placed withing the surrounding container
        labelOptions: this.$store.getters['main/labelOptions'],
        linkOptions: this.$store.getters['main/linkOptions'],
        canvas: false,
        size: {
          h: 0,
          w: 0
        }
      },
      isNetworkLoading: false,
      sliderOptions: {
        dotSize: 15
      },
      chartColors: [
        ['#2b6ca3', '#65add2', '#b0efff'],
        ['#a36c23', '#d59c1e', '#ffd20b']
      ],
      allNodesSelected: false
    };
  },
  created() {
    window.addEventListener('resize', this.resizeHandler);
  },
  mounted() {
    this.defineChartSize();
  },
  methods: {
    resizeHandler() {
      this.defineChartSize();
    },
    defineChartSize() {
      const heightRefElem = this.$refs.con?.parentElement;
      const widthRefElem = this.$refs.egoChart.$el.parentElement;

      const chartHeight = heightRefElem.clientHeight - 105;
      const chartWidth = widthRefElem.clientWidth;

      if (chartHeight) this.options.size.h = chartHeight;
      if (chartWidth) this.options.size.w = chartWidth;
    },
    handleYearChange(value) {
      this.isNetworkLoading = true;
      this.updateNetwork(this.generalNetwork);
      const position = this.calculateSliderPosition(value);
      this.mouseClick(position, 'year-slider-' + this.pane);
    },
    calculateSliderPosition(value) {
      //im sorry for this hacky workaround but vue slider doesnt register clicks on labels
      const sizes = this.$refs.sliderDiv.getBoundingClientRect();
      //x, y, width, height
      const clientY = sizes.y + sizes.height / 2;
      //indexes:   1 ---i-- array.length , where i is index of value
      //positions: 0 ---p-- width        , where p is position of i
      //and the rest is basic proportion calculation
      const arrayLength = this.generalNetwork.possibleYears.length;
      const index = this.generalNetwork.possibleYears.indexOf(value);
      const clientX = ((index + 1) * sizes.width) / arrayLength + sizes.x;
      //this calculation works with an error margin of couple of pixels
      //to be honest im disgusted and proud of this method
      return {
        clientX,
        clientY
      };
    },
    updateNetwork(network) {
      //important: the year is already updated in the sent network obj, because v-model is a two way binding on the vue-range-slider
      this.$store
        .dispatch('main/loadUpdatedGeneralNetwork', {
          network: network,
          pane: this.pane
        })
        .then(() => {
          this.isNetworkLoading = false;
        })
        .catch(() => {
          this.isNetworkLoading = false;
        });
      this.allNodesSelected = false;
      this.deselectAllNodes();
    },
    deselectAllNodes() {
      this.generalNetwork.nodes
        .filter(
          (node) =>
            this.$store.getters['main/selectedNodesForMetrics'].indexOf(node) >
            -1
        )
        .forEach((node) => {
          this.$store.commit('main/removeSelectedNodeForNodeMetrics', node);
        });
    }
  },
  computed: {
    generalNetwork() {
      const network = this.$store.getters['main/getPane'](
        this.pane
      ).selectedNetwork;
      const nodes = [];
      const links = [];
      let selectedNetwork;

      if (network) {
        for (const node of network.nodes) {
          let camelMetrics = {};
          //TODO: Not the right place to change this.. change it when it gets loaded from the backend
          for (let key in node.metrics)
            camelMetrics[snakeToCamel(key)] = node.metrics[key];
          nodes.push({
            id: network.id + '_' + node.id,
            name: node.text,
            _labelColor: this.$store.getters['main/posColors'][node.pos],
            _size: node.similarity * 40 /* Math.pow(200, node.similarity)*/,
            _color: this.chartColors[0][node.clusterId],
            _metrics: camelMetrics,
            _pane: this.pane,
            _absoluteFrequency: node.absoluteFrequency,
            _normalisedFrequency: node.normalisedFrequency,
            _pos: node.pos
          });
        }
        for (const link of network.edges) {
          links.push({
            sid: network.id + '_' + link.node1,
            tid: network.id + '_' + link.node2,
            similarity: link.similarity
          });
        }
        selectedNetwork = {
          id: network.id,
          nodes: nodes,
          links: links,
          year: network.year,
          possibleYears: network.possibleYears,
          party: network.party,
          speaker: network.speaker,
          filter: network.filter,
          type: network.type
        };
      }
      return selectedNetwork;
    }
  },
  watch: {}
};
</script>

<style src='vue-d3-network/dist/vue-d3-network.css'></style>

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

.b-0 {
  position: absolute;
  bottom: 0;
}
</style>
<style lang='scss'>
.year-slider-row {
  font-size: 0.9rem;
  min-height: 50px;
  padding: 10px 50px 0px 10px !important;

  .vue-slider {
    padding: 3px 7px 5px 5px !important;
    cursor: pointer;

    .vue-slider-rail {
      background-color: lightgrey;
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
