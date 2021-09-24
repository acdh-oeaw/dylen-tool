<template>
  <div>
    <div class="controls-container">
      <b-button
        @click="() => onZoomButtonClick(1.25)"
        variant="outline-secondary"
      >
        <b-icon icon="zoom-in"></b-icon>
      </b-button>
      <b-button
        @click="() => onZoomButtonClick(0.75)"
        variant="outline-secondary"
      >
        <b-icon icon="zoom-out"></b-icon>
      </b-button>
      <b-form-checkbox
        class="b-0"
        v-model="allNodesSelected"
        @change="selectionCheckboxChanged"
      >
        Select all nodes
      </b-form-checkbox>
    </div>
    <svg ref="svg" class="line-chart" :viewBox="viewBox">
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood flood-color="white" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g>
        <g class="links"></g>
        <g class="nodes"></g>
        <g class="labels"></g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'D3Network',
  props: ['netNodes', 'netLinks', 'options'],
  data() {
    return {
      d3Zoom: d3.zoom().on('zoom', this.zoom),
      scaleFactor: 1,
      translation: [0, 0],
      simulation: {},
      nodes: [],
      links: [],
      svg: {},
      allNodesSelected: false,
      focusedNode: [],
    };
  },
  watch: {
    netNodes: function (_, oldNodes) {
      this.deselectOldNodes(oldNodes);
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
    selectedNodes: function () {
      this.simulation.restart();
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
        .attr('stroke', (d) =>
          this.isSelected(d.index) ? this.getLineColor(d) : '#000'
        )
        .attr('stroke-width', (d) =>
          this.highlightedNodes.indexOf(d) > -1 || this.isSelected(d.index)
            ? 2
            : 1
        )
        .attr('fill', (_, idx) => this.netNodes[idx]._color)
        .on('click', (event, d) => this.addOrRemoveSelectedNode(d.index))
        .on('mouseenter', (event, d) => this.focusNode(d))
        .on('mouseleave', () => this.defocusNode());

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
        .attr('font-weight', (d) =>
          this.highlightedNodes.indexOf(d) > -1 ||
          this.options?.labelOptions?.bold
            ? 'bold'
            : 'normal'
        )
        .attr('filter', (d) =>
          this.options?.labelOptions?.background &&
          this.highlightedNodes.indexOf(d) > -1
            ? 'url(#solid)'
            : ''
        )
        .on('click', (event, d) => this.addOrRemoveSelectedNode(d.index));
      return l;
    },
    link() {
      return this.svg
        .select(`.links`)
        .selectAll('line')
        .data(this.links)
        .join('line')
        .attr(
          'stroke',
          (d) =>
            `rgba(0, 0, 0, ${
              this.isFocused(d) ? 1 : this.options?.linkOptions?.opacity
            })`
        )
        .attr('stroke-width', (d) => (this.isFocused(d) ? 2 : 1));
    },
    selectedNodes() {
      return this.$store.getters['main/selectedNodesForMetrics'];
    },
    highlightedNodes() {
      let targets = this.links
        .filter((link) => link.source == this.focusedNode)
        .map((link) => link.target);
      let sources = this.links
        .filter((link) => link.target == this.focusedNode)
        .map((link) => link.source);
      return [this.focusedNode].concat(targets).concat(sources);
    },
  },
  methods: {
    focusNode(node) {
      this.focusedNode = node;
      this.simulation.restart();
    },
    defocusNode() {
      this.focusedNode = null;
      this.simulation.restart();
    },
    isFocused(node) {
      return node.source == this.focusedNode || node.target == this.focusedNode;
    },
    addOrRemoveSelectedNode(node) {
      if (
        this.selectedNodes.find(
          (n) =>
            n.id == this.netNodes[node].id &&
            n._pane == this.netNodes[node]._pane
        )
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
    selectionCheckboxChanged() {
      if (this.allNodesSelected) this.selectAllNodes();
      else this.deselectAllNodes();
    },
    selectAllNodes() {
      this.netNodes
        .filter(
          (node) =>
            !this.$store.getters['main/selectedNodesForMetrics'].find(
              (n) => n.id == node.id && n._pane == node._pane
            )
        )
        .forEach((node) => {
          this.$store.commit('main/addSelectedNodeForNodeMetrics', node);
        });
    },
    deselectAllNodes() {
      this.netNodes
        .filter((node) =>
          this.$store.getters['main/selectedNodesForMetrics'].find(
            (n) => n.id == node.id && n._pane == node._pane
          )
        )
        .forEach((node) => {
          this.$store.commit('main/removeSelectedNodeForNodeMetrics', node);
        });
    },
    isSelected(node) {
      return Boolean(
        this.selectedNodes.find(
          (n) =>
            n.id == this.netNodes[node].id &&
            n._pane == this.netNodes[node]._pane
        )
      );
    },
    initNetwork() {
      this.svg = d3.select(this.$refs.svg).call(this.d3Zoom).select('g');
      this.updateSimulation();
    },
    onZoomButtonClick(zoomFactor = 1) {
      this.d3Zoom.scaleBy(
        d3.select(this.$refs.svg).transition().duration(500),
        zoomFactor
      );
      this.applyScaleAndTransform();
    },
    getNodeCoords(d) {
      const width = this.options.size.w;
      const height = this.options.size.h;
      const r = this.nodeSize / 2;
      let scaledX = this.translation[0] + this.scaleFactor * d.x;
      let scaledY = this.translation[1] + this.scaleFactor * d.y;
      return {
        x: this.options.boundingBox
          ? Math.max(r, Math.min(width - r, scaledX))
          : scaledX,
        y: this.options.boundingBox
          ? Math.max(r, Math.min(height - r, scaledY))
          : scaledY,
      };
    },
    applyScaleAndTransform() {
      let r = this.nodeSize / 2;
      this.link
        .attr('x1', (d) => this.getNodeCoords(d.source).x)
        .attr('y1', (d) => this.getNodeCoords(d.source).y)
        .attr('x2', (d) => this.getNodeCoords(d.target).x)
        .attr('y2', (d) => this.getNodeCoords(d.target).y);

      this.node
        .attr('cx', (d) => this.getNodeCoords(d).x)
        .attr('cy', (d) => this.getNodeCoords(d).y);

      if (this.options.nodeLabels)
        this.label
          .attr('x', (d) => this.getNodeCoords(d).x + r + 2)
          .attr('y', (d) => this.getNodeCoords(d).y + r / 2);
    },
    zoom(event) {
      this.scaleFactor = event.transform.k;
      this.translation = [event.transform.x, event.transform.y];
      this.applyScaleAndTransform();
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
    getLineColor(node) {
      if (node._pane == 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane == 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
  },
  mounted() {
    this.initNetwork();
  },
  beforeDestroy() {
    this.deselectAllNodes();
  },
};
</script>
<style>
svg .labels text {
  cursor: default;
}

.controls-container {
  position: absolute;
  background: #fff;
}
</style>
