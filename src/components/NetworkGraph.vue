<template>
  <div class="row">
    <div class="col" v-for="item in egoNetworks" :key="item.id">
      <d3-network :net-nodes="item.nodes" :net-links="item.links" :options="options"/>
    </div>
  </div>
</template>

<script>

import D3Network from 'vue-d3-network'

export default {
  name: 'NetworkGraph',
  components: {
    D3Network
  },
  props: {
  },
  data() {
    return {
      options: {
        force: 500,
        size:{ w:1200, h:700},
        nodeSize: 10,
        nodeLabels: true,
        canvas: false
      }
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    egoNetworks() {
      let networks = [];
      for (const network of this.$store.getters.egoNetworks) {
        let nodes = [];
        let links = [];
        for (const node of network.nodes) {
          nodes.push({
            id: nodes.length + 1,
            name: node.text,
            _size: node.similarity * 20
          });
        }
        for (const link of network.connections) {
          links.push({
            sid: link.node1,
            tid: link.node2
          });
        }
        networks.push({id: networks.length, nodes: nodes, links:links })
      }
      return networks;
    },
  },
  watch: {
  },
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
