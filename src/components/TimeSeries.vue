<template>
  <b-container
    ref='con'
    fluid
    class='mt-2 h-100'
    style='background-color: white;'
  >
    <b-row
      class='text-center'
      align-h='center'
    >
      <b-col class='h-10'><b>Time series Analysis</b></b-col>
      <b-button
        style='margin-right: 3.5rem'
        size='sm'
        :pressed.sync='showTable'
        variant='outline-secondary'
        data-sauto-id='time-series-table-button'
      >
        <b-icon v-if='showTable' icon='graph-up' data-sauto-id='time-series-table-button'></b-icon>
        <b-icon v-if='!showTable' icon='table' data-sauto-id='time-series-table-button'></b-icon>
      </b-button>
    </b-row>
    <b-row
      lg='12'
      class='pt-2 h-100'
    >
      <b-col class='h-100'>
        <b-select
          v-if='!showTable'
          class='w-50'
          v-model='selectedMetric'
          :options='metricOptions'
          size='sm'
          data-sauto-id='timeSeries-metric-option'
        >

        </b-select>
        <b-select
          v-if='!showTable'
          class='w-50'
          v-model='selectedRelativeTo'
          :options='relativeToOptions'
          size='sm'
          data-sauto-id='timeSeries-relative-option'
        >
        </b-select>
        <LineChart
          v-if='!showTable'
          ref='lineChart'
          :options='options'
          :data='selectedTimeSeriesData'
          :colors='lineColors'
          :labels='labels'
          data-sauto-id='timeSeries'
        ></LineChart>
        <time-series-table
          v-if='showTable'
          :options='options'>
        </time-series-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LineChart from '@/components/LineChart';
import { relativeToMap, timeSeriesKeyMap } from '@/helpers/mappers';
import TimeSeriesTable from '@/components/TimeSeriesTable';
import { GENERAL_PARTY, GENERAL_SPEAKER } from '@/helpers/mixins';

export default {
  name: 'TimeSeries',
  components: { TimeSeriesTable, LineChart },
  props: ['panes'],
  data() {
    return {
      options: {
        size: {
          h: 0,
          w: 0
        }
      },
      showTable: false,
      selectedMetric: timeSeriesKeyMap[this.firstMetric()],
      selectedRelativeTo: relativeToMap['firstYear']
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
    firstMetric() {
      const networkType = this.$store.getters['main/selectedNetwork']('pane1').type;

      if (networkType === 'Ego') {
        return 'freqDiffNorm';
      } else {
        return 'jaccardSimilarity';
      }
    },
    defineChartSize() {
      const heightRefElem = this.$refs.con?.parentElement;
      const widthRefElem = this.$refs.lineChart.$el.parentElement;

      const chartHeight = heightRefElem.clientHeight * 0.9 - 30;
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
        (p) => {
          let networkType = this.$store.getters['main/topNav'].networkType;
          if (networkType === GENERAL_PARTY) {
            return this.$store.getters['main/selectedGeneralNetworkParty'](p) ? this.$store.getters['main/selectedGeneralNetworkParty'](p).party : '';
          } else if (networkType === GENERAL_SPEAKER) {
            return this.$store.getters['main/selectedGeneralNetworkSpeaker'](p).loaded ? this.$store.getters['main/selectedGeneralNetworkSpeakerSpeaker'](p) : '';
          }
          return this.$store.getters['main/selectedTargetword'](p)?.text;
        }
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
          text: 'Metric: ' + key
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
          text: 'Relative to: ' + key
        };
      });
    }
  },
  watch: {}
};
</script>

<style scoped></style>
