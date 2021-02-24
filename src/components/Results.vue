<template>
  <div>
    <b-row>
      <b-col cols="6">
        <NetworkGraph pane="pane1"/>
      </b-col>
      <b-col cols="6">
        <NetworkGraph pane="pane2"/>
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
  mounted() {
  },
}
</script>

<style>
</style>
