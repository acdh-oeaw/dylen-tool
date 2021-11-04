<template>
  <b-row class='h-100'>
    <b-col
      class='h-100'
      md='6'
    >
      <b-row class='h-50'>
        <b-col
          class='h-100'
          md='12'
        >
          <NetworkGraph
            v-if='showFirstGraph'
            ref='networkGraph'
            pane='pane1'
          />
        </b-col>
      </b-row>
      <b-row class='h-50'>
        <b-col
          class='h-100'
          md='12'
        >
          <NetworkGraph
            v-if='showSecondGraph'
            pane='pane2'
          />
        </b-col>
      </b-row>
    </b-col>
    <b-col v-if='showFirstGraph || showSecondGraph'
      class='h-100'
      md='6'
    >
      <b-row class='h-50'>
        <b-col class='h-100'>
          <NodeMetrics>
          </NodeMetrics>
        </b-col>
      </b-row>
      <b-row class='h-50'>
        <b-col class='h-100'>
          <hr/>
          <TimeSeries :panes="['pane1', 'pane2']">
          </TimeSeries>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import NetworkGraph from '@/components/NetworkGraph';
import NodeMetrics from '@/components/NodeMetrics';
import TimeSeries from '@/components/TimeSeries';

export default {
  name: 'Results',
  props: ['pane'],
  components: {
    NodeMetrics,
    NetworkGraph,
    TimeSeries
  },
  computed: {
    networkCount() {
      return this.$store.getters['main/numberOfNetworksVisualised']
    },
    showFirstGraph() {
      return this.$store.getters['main/selectedNetwork']('pane1') !== null
    },
    showSecondGraph() {
      return this.$store.getters['main/selectedNetwork']('pane2') !== null
    }
  },
  mounted() {}
};
</script>

<style></style>
