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
    >
      <b-col class='h-100'>
        <LineChart
          ref="lineChart"
          :net-nodes='nodes'
          :options='options'
        ></LineChart>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LineChart from '@/components/LineChart';

export default {
  name: 'NodeMetrics',
  components: { LineChart },
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
      const widthRefElem = this.$refs.lineChart.$el.parentElement;

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
