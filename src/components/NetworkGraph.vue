<template>
  <div class="row">
    <div class="col-md-6" style="height: 600px;" v-for="item in egoNetworks" :key="item.id">
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
        force: 750,
        nodeSize: 30,
        nodeLabels: true,
        canvas: false
      },
      chartColors: [
        ['#2b6ca3', '#65add2', '#b0efff'],
        ['#a36c23', '#d59c1e', '#ffd20b']
      ]
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
            _size: node.similarity * 40, /* Math.pow(200, node.similarity)*/
            _color: this.chartColors[networks.length][node.clusterId]
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

<style scoped>
  .link {
    stroke: rgb(18 120 98 / 0.15);
  }
  .node-label {
    font-size: 11px;
  }
</style>
