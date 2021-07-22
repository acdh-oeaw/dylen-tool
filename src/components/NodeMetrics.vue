<template>
  <b-container
    ref="con"
    fluid
    class="mt-2"
    style="background-color: white;"
  >
    <b-row
      lg="12"
      class="pt-2"
      @mouseover="mouseOver"
    >
      <b-col>
        <parallel-coordinates
          ref="parCoords"
          v-if="nodes"
          :net-nodes="nodes"
          :options="options"
        >

        </parallel-coordinates>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
import ParallelCoordinates from '@/components/ParallelCoordinates';
export default {
  name: 'NodeMetrics',
  components: { ParallelCoordinates },
  props: ['pane'],
  data() {
    return {
      options: {
        size: {
          h: 0,
          w: 0,
        },
      },
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
      const widthRefElem = this.$refs.parCoords.$el.parentElement;
      console.log(heightRefElem.clientHeight);

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
          _metrics: node.metrics,
        });
      }
      return nodes;
    },
  },
  computed: {
    nodes() {
      return this.$store.getters['main/selectedNodesForMetrics'];
    },
  },
  watch: {},
};
</script>

<style scoped>
</style>