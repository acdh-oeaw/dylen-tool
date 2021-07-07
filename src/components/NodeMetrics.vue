<template>
  <b-container
    ref="con"
    fluid
    class="mt-2"
    style="background-color: white;"
  >
    <b-row
      lg="12"
      class="pt-2"
      @mouseover="mouseOver"
    >
      <b-col>
        <parallel-coordinates
          v-if="nodes"
          :net-nodes="nodes"
          :options="options"
        >

        </parallel-coordinates>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
import ParallelCoordinates from '@/components/ParallelCoordinates';
export default {
  name: 'NodeMetrics',
  components: { ParallelCoordinates },
  props: ['pane'],
  data() {
    return {
      options: {
        size: {
          h: 100,
          w: 300,
        },
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    prepareNode(network) {
      const nodes = [];
      for (const node of network) {
        nodes.push({
          id: network.id + '_' + node.id,
          name: node.text,
          _metrics: node.metrics,
        });
      }
      return nodes;
    },
  },
  computed: {
    nodes() {
      return this.$store.getters['main/selectedNodesForMetrics'];
    },
  },
  watch: {},
};
</script>

<style scoped>
</style>