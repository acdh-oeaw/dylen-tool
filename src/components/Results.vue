<template>
  <div class="col-md-12 h-100">
    <b-row class="h-100">
      <b-col class="col-md-6 h-100">
        <NetworkGraph
            v-if="networkCount>=1"
            ref="networkGraph"
            class="col-md-12 h-45"
            pane="pane1"/>
        <NetworkGraph
            class="col-md-12 h-45"
            v-if="networkCount==2"
            pane="pane2"/>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import NetworkGraph from '@/components/NetworkGraph';

export default {
  name: 'Results',
  props: ['pane'],
  components: {
    NetworkGraph
  },
  computed: {
    networkCount() {
      let count = 0;
      const network1 = this.$store.getters["main/getPane"]('pane1').selectedNetwork
      const network2 = this.$store.getters["main/getPane"]('pane2').selectedNetwork

      if (network1) {
        count++;
      }
      if (network2) {
        count++;
      }

      return count;
    }
  },
  mounted() {
  },
}
</script>

<style>
</style>
