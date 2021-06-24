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
      scaleFactor: 1,
      translation: [0, 0],
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
    size: {
      handler() {
        this.initNetwork();
      },
      deep: true,
    },
    options: {
      handler() {
        this.simulation.restart();
      },
      deep: true,
    },
  },
  computed: {
    size() {
      return this.options.size;
    },
    viewBox() {
      return `0 0 ${this.size.w} ${this.size.h}`;
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
        .attr('fill', (_, idx) => this.netNodes[idx]._color);
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
        .attr('fill', (_, idx) => this.netNodes[idx]._labelColor)
        .attr('font-size', this.options?.labelOptions?.fontSize)
        .attr(
          'font-weight',
          this.options?.labelOptions?.bold ? 'bold' : 'normal'
        );
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
        .attr('stroke', `rgba(0, 0, 0, ${this.options?.linkOptions?.opacity})`)
        .attr('stroke-width', 1);
    },
  },
  methods: {
    getNodeCoords(d) {
      const width = this.options.size.w;
      const height = this.options.size.h;
      const r = this.nodeSize / 2;
      return {
        x: this.options.boundingBox
          ? Math.max(r, Math.min(width - r, d.x))
          : d.x,
        y: this.options.boundingBox
          ? Math.max(r, Math.min(height - r, d.y))
          : d.y,
      };
    },
    transformNode(t) {
      return function (d) {
        return `translate(${t.apply([d.x, d.y])})`;
      };
    },
    applyScaleAndTransform() {
      let r = this.nodeSize / 2;
      this.link
        .attr('x1', (d) => this.translation[0] + this.scaleFactor * d.source.x)
        .attr('y1', (d) => this.translation[1] + this.scaleFactor * d.source.y)
        .attr('x2', (d) => this.translation[0] + this.scaleFactor * d.target.x)
        .attr('y2', (d) => this.translation[1] + this.scaleFactor * d.target.y);

      this.node
        .attr('cx', (d) => this.translation[0] + this.scaleFactor * d.x)
        .attr('cy', (d) => this.translation[1] + this.scaleFactor * d.y);

      if (this.options.nodeLabels)
        this.label
          .attr('x', (d) => this.translation[0] + this.scaleFactor * d.x + r)
          .attr('y', (d) => this.translation[1] + this.scaleFactor * d.y + r);
    },
    zoom(event) {
      this.scaleFactor = event.transform.k;
      this.translation = [event.transform.x, event.transform.y];
      this.applyScaleAndTransform();
    },
    initNetwork() {
      console.log(this.transformNode(d3.zoomIdentity));
      this.svg = d3
        .select(this.$refs.svg)
        .call(d3.zoom().on('zoom', this.zoom))
        .select('g');
      this.updateSimulation();
    },
    updateSimulation() {
      const options = this.options;
      const width = options.size.w;
      const height = options.size.h;
      if (width <= 0 || height <= 0) return;
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
        this.applyScaleAndTransform();
      });
    },
    dragstarted(event, d) {
      let mousePos = [event.sourceEvent.offsetX, event.sourceEvent.offsetY];
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = (mousePos[0] - this.translation[0]) / this.scaleFactor;
      d.fy = (mousePos[1] - this.translation[1]) / this.scaleFactor;
    },

    dragged(event, d) {
      let mousePos = [event.sourceEvent.offsetX, event.sourceEvent.offsetY];
      d.fx = (mousePos[0] - this.translation[0]) / this.scaleFactor;
      d.fy = (mousePos[1] - this.translation[1]) / this.scaleFactor;
      this.applyScaleAndTransform();
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
