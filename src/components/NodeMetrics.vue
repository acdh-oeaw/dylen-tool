<template>
  <b-container
    ref='con'
    fluid
    class='mt-2 h-100'
    style='background-color: white;'
  >
    <b-row
      lg='12'
      class='pt-2 h-100'
      @mouseover='mouseOver'
    >
      <b-col class='h-100'>
        <b-button-group class='float-right'>
          <b-dropdown
            id='dropdown-1'
            v-if='nodes && showTable'
            no-caret
            right
          >
            <template #button-content>
              <b-icon icon='download'></b-icon>
              <span class='sr-only'>Download</span>
            </template>
            <b-dropdown-item-button @click='csvExport'>Export CSV</b-dropdown-item-button>
            <b-dropdown-item-button @click='jsonExport'>Export JSON</b-dropdown-item-button>
          </b-dropdown>
          <b-button
            :pressed.sync='showTable'
            variant='outline-secondary'
          >
            <b-icon icon='table'></b-icon>
          </b-button>
        </b-button-group>
        <parallel-coordinates
          ref='parCoords'
          v-if='nodes && !showTable'
          :net-nodes='nodes'
          :options='options'
        ></parallel-coordinates>
        <metrics-table
          ref='table'
          v-if='nodes && showTable'
          :selected-nodes='nodes'
          :all-nodes='allNodes'
          :options='options'
        ></metrics-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ParallelCoordinates from '@/components/ParallelCoordinates';
import MetricsTable from '@/components/MetricsTable';

export default {
  name: 'NodeMetrics',
  components: { ParallelCoordinates, MetricsTable },
  props: ['pane'],
  data() {
    return {
      options: {
        size: {
          h: 0,
          w: 0
        }
      },
      showTable: false
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
      const widthRefElem = (this.$refs.parCoords || this.$refs.table).$el
        .parentElement;

      const chartHeight = heightRefElem.clientHeight * 1.0;
      const chartWidth = widthRefElem?.clientWidth / 1.08;

      if (chartHeight) this.options.size.h = chartHeight;
      if (chartWidth) this.options.size.w = chartWidth;
    },
    prepareNode(network) {
      const nodes = [];
      for (const node of network) {
        nodes.push({
          id: network.id + '_' + node.id,
          name: node.text,
          _metrics: node.metrics
        });
      }
      return nodes;
    },
    csvExport() {
      this.$store.dispatch('main/downloadMetricsAsCSV', this.nodes);
    },
    jsonExport() {
      this.$store.dispatch('main/downloadMetricsAsJSON', this.nodes);
    }
  },
  computed: {
    nodes() {
      return this.$store.getters['main/selectedNodesForMetrics'];
    },
    allNodes() {
      let nodes = [];
      const networks = [
        this.$store.getters['main/getPane']('pane1')?.selectedNetwork,
        this.$store.getters['main/getPane']('pane2')?.selectedNetwork
      ];
      networks.forEach((network, idx) => {
        if (network) {
          for (const node of network.nodes) {
            nodes.push({
              id: network.id + '_' + node.id,
              name: node.text,
              _metrics: node.metrics,
              _pane: `pane${idx + 1}`
            });
          }
        }
      });
      return nodes;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
