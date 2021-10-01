<template>
  <b-container
    ref='con'
    fluid
    class='mt-2'
    style='background-color: white'
    v-if='egoNetwork'
  >
    <b-row class='h-10'>
      <b-col>
        <b-row align-h='center'>
          <span><b>{{ egoNetwork.text }}</b> ({{ egoNetwork.corpus }} / {{ egoNetwork.subcorpus }})</span>
        </b-row>
      </b-col>
    </b-row>
    <b-row
      lg='12'
      class='pt-2 h-70'
      v-bind='egoNetwork'
      :key='egoNetwork.id'
      @mouseover='mouseOver'
      data-sauto-id='ignore'
    >
      <b-col>
        <d3-network
          ref='egoChart'
          class='network-wrapper'
          :net-nodes='egoNetwork.nodes'
          :net-links='egoNetwork.links'
          :options='options'
          :pane='this.pane'
        />
      </b-col>
    </b-row>
    <b-row class='h-20 pb-2'>
      <!--      <b-col xl='2'></b-col>-->
      <b-col class='pl-5 year-slider-row' data-sauto-id='ignore'>
        <div ref='sliderDiv'>
          <vue-slider
            ref='slider'
            v-model='egoNetwork.year'
            v-bind='sliderOptions'
            :min='egoNetwork.possibleYears[0]'
            :max='egoNetwork.possibleYears[egoNetwork.possibleYears.length - 1]'
            :data='egoNetwork.possibleYears'
            :process='false'
            :lazy='true'
            :adsorb='true'
            :duration='0.3'
            v-on:change='handleChange'
            :marks='egoNetwork.possibleYears'
            :tooltip="'none'"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<!--v-on:change='updateNetwork(egoNetwork)'-->
<script>
import D3Network from './D3Network';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

export default {
  name: 'NetworkGraph',
  components: {
    D3Network,
    VueSlider
  },
  props: ['pane'],
  data() {
    return {
      options: {
        /* force: 100, */
        nodeSize: 15,
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

      const chartHeight = heightRefElem.clientHeight * 0.7;
      const chartWidth = widthRefElem.clientWidth / 1.08;

      if (chartHeight) this.options.size.h = chartHeight;
      if (chartWidth) this.options.size.w = chartWidth;
    },
    handleChange(value) {
      this.updateNetwork(this.egoNetwork);
      const position = this.calculateSliderPosition(value);
      this.mouseClick(position, 'year-slider-' + this.pane + '-' + value);
    },
    calculateSliderPosition(value) {
      //im sorry for this hacky workaround but vue slider doesnt register clicks on labels
      const sizes = this.$refs.sliderDiv.getBoundingClientRect();
      //x, y, width, height
      const clientY = sizes.y + sizes.height / 2;
      //indexes:   1 ---i-- array.length , where i is index of value
      //positions: 0 ---p-- width        , where p is position of i
      //and the rest is basic proportion calculation
      const arrayLength = this.egoNetwork.possibleYears.length;
      const index = this.egoNetwork.possibleYears.indexOf(value);
      const clientX = (((index + 1) * sizes.width) / arrayLength) + sizes.x;
      //this calculation works with an error margin of couple of pixels
      //to be honest im disgusted and proud of this method
      return {
        clientX,
        clientY
      };
    },
    updateNetwork(network) {
      //important: the year is already updated in the sent network obj, because v-model is a two way binding on the vue-range-slider
      this.$store.dispatch('main/loadUpdatedEgoNetwork', {
        network: network,
        pane: this.pane
      });
      this.allNodesSelected = false;
      this.deselectAllNodes();
    },
    selectionCheckboxChanged() {
      if (this.allNodesSelected) this.selectAllNodes();
      else this.deselectAllNodes();
    },
    selectAllNodes() {
      this.egoNetwork.nodes
        .filter(
          (node) =>
            this.$store.getters['main/selectedNodesForMetrics'].indexOf(node) <
            0
        )
        .forEach((node) => {
          this.$store.commit('main/addSelectedNodeForNodeMetrics', node);
        });
    },
    deselectAllNodes() {
      this.egoNetwork.nodes
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
    egoNetwork() {
      const network = this.$store.getters['main/getPane'](this.pane).selectedNetwork;
      const nodes = [];
      const links = [];
      let selectedNetwork;

      if (network) {
        for (const node of network.nodes) {
          nodes.push({
            id: network.id + '_' + node.id,
            name: node.text,
            _labelColor: this.$store.getters['main/posColors'][node.pos],
            _size: node.similarity * 40 /* Math.pow(200, node.similarity)*/,
            _color: this.chartColors[0][node.clusterId],
            _metrics: node.metrics,
            _pane: this.pane
          });
        }
        for (const link of network.edges) {
          links.push({
            sid: network.id + '_' + link.node1,
            tid: network.id + '_' + link.node2
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
      background-color: grey;
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
