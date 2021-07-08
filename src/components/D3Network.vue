<template>
  <svg
    ref="svg"
    class="line-chart"
    :viewBox="viewBox"
  >
    <g>
      <g class="links"></g>
      <g class="nodes"></g>
      <g class="labels"></g>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'D3Network',
  props: ['netNodes', 'netLinks', 'options'],
  data() {
    return {
      simulation: {},
      nodes: [],
      links: [],
      svg: {},
    };
  },
  watch: {
    netNodes: function () {
      this.updateSimulation();
    },
    netLinks: function () {
      this.updateSimulation();
    },
    options: {
      handler() {
        this.initNetwork();
      },
      deep: true,
    },
  },
  computed: {
    viewBox() {
      return `0 0 ${this.options.size.w} ${this.options.size.h}`;
    },
    nodeSize() {
      return this.options.nodeSize || 15;
    },
    force() {
      // get number of clusters
      let clusters = [...new Set(this.netNodes.map((n) => n._color))];
      return this.options.force || 100 / clusters.length;
    },
    node() {
      let n = this.svg
        .select('.nodes')
        .selectAll('circle')
        .data(this.nodes)
        .join('circle')
        .attr('r', this.nodeSize / 2)
        .attr('stroke', '#000')
        .attr('fill', (_, idx) => this.netNodes[idx]._color)
        .on('click', (event, d) => this.addSelectedNode(d.index));
      n.append('title').text((d) => d.name);
      n.call(
        d3
          .drag()
          .on('start', this.dragstarted)
          .on('drag', this.dragged)
          .on('end', this.dragended)
      );

      return n;
    },
    label() {
      let l = this.svg
        .select(`.labels`)
        .selectAll('text')
        .data(this.nodes)
        .join('text')
        .text((_, idx) => this.netNodes[idx].name)
        .attr('fill', '#000');
      l.call(
        d3
          .drag()
          .on('start', this.dragstarted)
          .on('drag', this.dragged)
          .on('end', this.dragended)
      );
      return l;
    },
    link() {
      return this.svg
        .select(`.links`)
        .selectAll('line')
        .data(this.links)
        .join('line')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1);
    },
  },
  methods: {
    addOrRemoveSelectedNode(node) {
      if (
        this.$store.getters['main/selectedNodesForMetrics'].indexOf(
          this.netNodes[node]
        ) > -1
      ) {
        this.$store.commit(
          'main/removeSelectedNodeForNodeMetrics',
          this.netNodes[node]
        );
      } else {
        this.$store.commit(
          'main/addSelectedNodeForNodeMetrics',
          this.netNodes[node]
        );
      }
    },
    initNetwork() {
      this.svg = d3
        .select(this.$refs.svg)
        .call(
          d3
            .zoom()
            .on('zoom', (event) => this.svg.attr('transform', event.transform))
        )
        .select('g');
      this.updateSimulation();
    },
    updateSimulation() {
      const options = this.options;
      const width = options.size.w;
      const height = options.size.h;
      if (width <= 0 || height <= 0) return;
      const r = this.nodeSize / 2;
      this.nodes = this.netNodes.map((d) => Object.create(d));
      this.links = this.netLinks.map((d) => {
        return { source: d.sid, target: d.tid };
      });

      this.simulation = d3
        .forceSimulation(this.nodes)
        .force(
          'link',
          d3
            .forceLink(this.links)
            .id((d) => `${d.id}`)
            .distance(options.nodeDistance || 75)
        )
        .force('charge', d3.forceManyBody() /* .strength(-this.force) */)
        .force('center', d3.forceCenter(width / 2, height / 2));

      this.simulation.on('tick', () => {
        this.link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        this.node
          .attr('cx', function (d) {
            return (d.x = options.boundingBox
              ? Math.max(r, Math.min(width - r, d.x))
              : d.x);
          })
          .attr('cy', function (d) {
            return (d.y = options.boundingBox
              ? Math.max(r, Math.min(height - r, d.y))
              : d.y);
          });
        if (options.nodeLabels)
          this.label.attr('x', (d) => d.x + r).attr('y', (d) => d.y + r);
      });
    },
    dragstarted(event, d) {
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    },

    dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    },

    dragended(event, d) {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    },
  },
  mounted() {
    this.initNetwork();
  },
};
</script>
<style>
svg .labels text {
  cursor: default;
}
</style>
