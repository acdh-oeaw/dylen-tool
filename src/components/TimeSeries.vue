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
          class="w-50"
          v-model="selectedMetric"
          :options="metricOptions"
        >

        </b-select>
        <b-select
          class="w-50"
          v-model="selectedRelativeTo"
          :options="relativeToOptions"
        >

        </b-select>
        <LineChart
          ref="lineChart"
          :options='options'
          :data="selectedTimeSeriesData"
          :colors="lineColors"
          :labels="labels"
        ></LineChart>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LineChart from '@/components/LineChart';

export default {
  name: 'TimeSeries',
  components: { LineChart },
  props: ['panes'],
  data() {
    return {
      options: {
        size: {
          h: 0,
          w: 0
        }
      },
      selectedMetric: 'freqDiffNorm',
      selectedRelativeTo: 'firstYear'
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
    lineColors() {
      return this.$store.getters['main/selectionColors'];
    },
    labels() {
      return ['pane1', 'pane2'].map(
        (p) => this.$store.getters['main/selectedTargetword'](p)?.text
      );
    },
    timeSeriesData() {
      return ['pane1', 'pane2'].map((p) =>
        this.$store.getters['main/timeSeriesData'](p)
      );
    },
    selectedTimeSeriesData() {
      return (
        this.timeSeriesData
          //.filter((d) => d[this.selectedMetric])
          .map((targetword) =>
            targetword[this.selectedMetric]
              ? targetword[this.selectedMetric][this.selectedRelativeTo]
              : []
          )
      );
    },
    metricOptions() {
      return [
        ...new Set(
          this.timeSeriesData
            .map((targetword) => Object.keys(targetword))
            .flat()
        )
      ].map((key) => {
        return {
          value: key,
          text: key
        };
      });
    },
    relativeToOptions() {
      return [
        ...new Set(
          this.timeSeriesData
            .map((targetword) =>
              Object.values(targetword).map((subSeries) =>
                Object.keys(subSeries)
              )
            )
            .flat(2)
        )
      ].map((key) => {
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
