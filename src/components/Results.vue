<template>
  <div class="col-md-12">
    <b-row>
      <b-col class="col-md-6">
        <NetworkGraph
            class="col-md-12"
            pane="pane1"/>
        <NetworkGraph
            style="height:50%;"
            class="col-md-12"
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
  props: ['pane'],
  components: {
    NetworkGraph
  },
  computed: {
    networkCount() {
      let count = 0;
      const network1 = this.$store.getters["main/getPane"]('pane1').selectedNetwork
      const network2 = this.$store.getters["main/getPane"]('pane2').selectedNetwork

      if (network1 || network2) {
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
