<template>
  <b-container
    ref='con'
    fluid
    class='mt-2 h-100'
    style='background-color: white;'
  >
    <b-row
      xl='12'
      class='text-center'
      align-h='center'
    >
      <b-col xl='2'></b-col>
      <b-col class="h-8"><b>Node Metrics Comparison</b></b-col>
      <b-col xl='2'>
        <b-button-group
          size='sm'
          class='float-right'
        >
          <b-dropdown
            size='sm'
            v-b-tooltip.hover
            title="Download CSV/JSON"
            id='dropdown-1'
            v-if='nodes && showTable'
            no-caret
            right
          >
            <template #button-content>
              <b-icon icon='download'></b-icon>
              <span class='sr-only'>Download</span>
            </template>
            <b-dropdown-item-button
              data-sauto-id="export-csv-button"
              @click='csvExport'
            >Export CSV</b-dropdown-item-button>
            <b-dropdown-item-button
              data-sauto-id="export-json-button"
              @click='jsonExport'
            >Export JSON</b-dropdown-item-button>
          </b-dropdown>
          <b-button
            class='mr-5'
            size='sm'
            :pressed.sync='showTable'
            variant='outline-secondary'
            data-sauto-id='table-button'
          >
            <b-icon
              v-if='showTable'
              icon='graph-up'
            ></b-icon>
            <b-icon
              v-if='!showTable'
              icon='table'
            ></b-icon>
          </b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row
      lg='12'
      class='h-100'
    >
      <b-col class='h-100'>
        <parallel-coordinates
          ref='parCoords'
          v-if='!showTable'
          :all-nodes='allNodes'
          :selected-nodes='nodes'
          :options='options'
        ></parallel-coordinates>
        <metrics-table
          ref='table'
          v-if='showTable'
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
import { snakeToCamel } from '@/helpers/utils';

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

      const chartHeight = heightRefElem.clientHeight - 50;
      const chartWidth = widthRefElem?.clientWidth;

      if (chartHeight) this.options.size.h = chartHeight;
      if (chartWidth) this.options.size.w = chartWidth;
    },
    csvExport() {
      this.$store.dispatch('main/downloadMetricsAsCSV', {
        allNodes: this.allNodes,
        selectedNodes: this.nodes
      });
    },
    jsonExport() {
      this.$store.dispatch('main/downloadMetricsAsJSON', {
        allNodes: this.allNodes,
        selectedNodes: this.nodes
      });
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
            let camelMetrics = {};
            for (let key in node.metrics)
              camelMetrics[snakeToCamel(key)] = node.metrics[key];
            nodes.push({
              id: network.id + '_' + node.id,
              name: node.text,
              _normalisedFrequency: node.normalisedFrequency,
              _metrics: camelMetrics,
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
