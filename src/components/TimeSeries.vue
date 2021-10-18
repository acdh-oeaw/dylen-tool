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
        <b-select
          v-model="selectedMetric"
          :options="metricOptions"
        >

        </b-select>
        <LineChart
          ref="lineChart"
          :options='options'
          :data="timeSeries[selectedMetric]"
        ></LineChart>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LineChart from '@/components/LineChart';
import data from '@/Arbeit-n_ts.json';

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
      timeSeries: data.time_series,
      selectedMetric: 'freq_diff_norm'
    };
  },
  created() {
    window.addEventListener('resize', this.resizeHandler);
  },
  mounted() {
    this.defineChartSize();
    console.log(this.timeSeries);
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
    metricOptions() {
      return Object.keys(this.timeSeries).map((key) => {
        return {
          value: key,
          text: key
        };
      });
    }
  },
  watch: {}
};
</script>

<style scoped></style>
