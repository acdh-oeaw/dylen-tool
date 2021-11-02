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
            v-if='networkCount>=1'
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
            v-if='networkCount===2'
            pane='pane2'
          />
        </b-col>
      </b-row>
    </b-col>
    <b-col
      class='h-100'
      md='6'
    >
      <b-row class='h-50'>
        <b-col class='h-100'>
          <NodeMetrics>
          </NodeMetrics>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import NetworkGraph from '@/components/NetworkGraph';
import NodeMetrics from '@/components/NodeMetrics';

export default {
  name: 'Results',
  props: ['pane'],
  components: {
    NodeMetrics,
    NetworkGraph
  },
  computed: {
    networkCount() {
      return this.$store.getters['main/numberOfNetworksVisualised']
    }
  },
  mounted() {
  }
};
</script>

<style></style>
