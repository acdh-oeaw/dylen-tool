<template>
  <div>
    <NetworkGraph pane="pane1"/>
    <NetworkGraph pane="pane2"/>
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
