<template>
  <div>
    <b-row>
      <b-col cols="6">
        <NetworkGraph pane="pane1"/>
      </b-col>
      <b-col cols="6">
        <NetworkGraph
            v-if="networkCount>=1"
            pane="pane2"/>
      </b-col>
    </b-row>

  </div>
</template>

<script>

import NetworkGraph from '@/components/NetworkGraph';

export default {
  name: 'Results',
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
