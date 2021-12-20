<template>
  <div>
    <div class='controls-container'>
      <div>
        <b-button
          @click='() => onZoomButtonClick(1.25)'
          variant='outline-secondary'
          :data-sauto-id="'zoom-in-button-'+this.pane"
        >
          <b-icon icon='zoom-in'></b-icon>
        </b-button>
      </div>
      <div>
        <b-button
          @click='() => onZoomButtonClick(0.75)'
          variant='outline-secondary'
          :data-sauto-id="'zoom-out-button-'+this.pane"
        >
          <b-icon icon='zoom-out'></b-icon>
        </b-button>
      </div>
      <div>

        <b-button
          @click='() => resetZoomAndPan()'
          variant='outline-secondary'
          :data-sauto-id="'zoom-reset-button-'+this.pane"
          title="Reset zoom and pan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-bootstrap-reboot"
            viewBox="0 0 16 16"
          >
            <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z" />
            <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z" />
          </svg>
        </b-button>
      </div>

    </div>
    <div class="checkbox-container">
      <div
        class='ego-checkbox'
        data-sauto-id='ignore'
      >
        <b-form-checkbox
          class='b-0'
          v-model='isAllSelected'
          @change='selectionCheckboxChanged'
          :data-sauto-id="'select-all-checkbox-'+this.pane"
        >
          select all
        </b-form-checkbox>
      </div>
    </div>
    <svg
      ref='svg'
      class='line-chart'
      :viewBox='viewBox'
    >
      <defs>
        <filter
          x='0'
          y='0'
          width='1'
          height='1'
          id='solid'
        >
          <feFlood flood-color='white' />
          <feComposite in='SourceGraphic' />
        </filter>
      </defs>
      <g>
        <g class='links'></g>
        <g class='labels'></g>
        <g class='nodes'></g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { mixin } from '@/store/store';

export default {
  name: 'D3Network',
  props: ['netNodes', 'netLinks', 'options', 'pane'],
  mixins: [mixin],
  data() {
    return {
      d3Zoom: d3.zoom().on('zoom', this.zoom),
      simulation: {},
      nodes: [],
      links: [],
      svg: {},
      transform: d3.zoomIdentity
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
        this.initNetwork(true);
      },
      deep: true
    },
    selectedNodes: function () {
      this.simulation.restart();
    },
    options: {
      handler() {
        this.simulation.restart();
      },
      deep: true
    },
    sharedNode: {
      handler() {
        this.simulation.restart();
      },
      deep: true
    }
  },
  computed: {
    sharedNode() {
      return this.$store.getters['main/focusNode'];
    },
    focusedNode() {
      return this.nodes.filter((node) => this.sharedNode === node.id);
    },
    isAllSelected: {
      get: function () {
        let selectedSize = this.netNodes.filter((node) =>
          this.$store.getters['main/selectedNodesForMetrics'].find(
            (n) => n.id === node.id && n._pane === node._pane
          )
        ).length;
        let allSize = this.netNodes.length;
        return selectedSize === allSize;
      },
      set: function () {}
    },
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
        .attr('r', (d) => this.scaleNodeSize(d._absoluteFrequency))
        .attr('stroke', (d) =>
          this.isSelected(d.index) ? this.getLineColor(d) : '#000'
        )
        .attr('stroke-width', (d) =>
          this.highlightedNodes.indexOf(d) > -1 || this.isSelected(d.index)
            ? 2
            : 1
        )
        .attr('fill', (_, idx) => this.netNodes[idx]._color)
        .on('click', (event, d) => {
          this.addOrRemoveSelectedNode(d.index);
          this.mouseClick(event, this.pane + '-node');
        })
        .on('mouseenter', (event, d) => this.focusNode(d))
        .on('mouseleave', (event, d) => this.defocusNode(d));

      n.append('title').text((d) => d.name);
      n.call(
        d3
          .drag()
          .subject(this.dragsubject)
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
        .on('click', (event, d) => {
          this.addOrRemoveSelectedNode(d.index);
          this.mouseClick(event, this.pane + '-label');
        });
      l.call(
        d3
          .drag()
          .subject(this.dragsubject)
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
        .attr(
          'stroke',
          (d) =>
            `rgba(0, 0, 0, ${
              this.isFocused(d) ? 1 : this.options?.linkOptions?.opacity
            })`
        )
        .attr('stroke-width', (d) => this.scaleThickness(d.similarity));
    },

    selectedNodes() {
      return this.$store.getters['main/selectedNodesForMetrics'];
    },
    highlightedNodes() {
      let targets = this.links
        .filter((link) => this.sharedNode === link.source.id)
        .map((link) => link.target);
      let sources = this.links
        .filter((link) => this.sharedNode === link.target.id)
        .map((link) => link.source);
      return this.focusedNode.concat(targets).concat(sources);
    },
    scaleThickness() {
      return d3
        .scaleLinear()
        .domain([
          d3.min(this.netLinks, (d) => d.similarity),
          d3.max(this.netLinks, (d) => d.similarity)
        ])
        .range([0.3, 3]);
    },
    scaleNodeSize() {
      return d3
        .scaleLinear()
        .domain([
          d3.min(this.netNodes, (d) => d._absoluteFrequency),
          d3.max(this.netNodes, (d) => d._absoluteFrequency)
        ])
        .range([this.nodeSize / 2, this.nodeSize * 1.5]);
    }
  },
  methods: {
    dragsubject(event) {
      for (let i = this.nodes.length - 1; i >= 0; --i) {
        let node = this.nodes[i];
        if (
          event.sourceEvent.target === this.node._groups[0][i] ||
          event.sourceEvent.target === this.label._groups[0][i]
        ) {
          node.x = this.transform.applyX(node.x);
          node.y = this.transform.applyY(node.y);

          return node;
        }
      }
      return null;
    },
    focusNode(node) {
      if (this.sharedNode !== node.id) {
        this.$store.commit('main/addFocusNode', { node: node.id });
      }
      this.simulation.restart();
    },
    defocusNode(node) {
      if (this.sharedNode === node.id)
        this.$store.commit('main/removeFocusNode', { node: node.id });
      this.simulation.restart();
    },
    isFocused(node) {
      return (
        this.sharedNode === node.source.id || this.sharedNode === node.target.id
      );
    },
    addOrRemoveSelectedNode(node) {
      if (
        this.selectedNodes.find(
          (n) =>
            n.id === this.netNodes[node].id &&
            n._pane === this.netNodes[node]._pane
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
      if (this.isAllSelected) this.deselectAllNodes();
      else this.selectAllNodes();
    },
    selectAllNodes() {
      this.netNodes
        .filter(
          (node) =>
            !this.$store.getters['main/selectedNodesForMetrics'].find(
              (n) => n.id === node.id && n._pane === node._pane
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
            (n) => n.id === node.id && n._pane === node._pane
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
            n.id === this.netNodes[node].id &&
            n._pane === this.netNodes[node]._pane
        )
      );
    },
    initNetwork(resize) {
      this.svg = d3.select(this.$refs.svg).call(this.d3Zoom).select('g');
      this.updateSimulation();
      if (!resize) this.selectAllNodes();
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
      let scaledX = this.transform.applyX(d.x);
      let scaledY = this.transform.applyY(d.y);
      return {
        x: this.options.boundingBox
          ? Math.max(r, Math.min(width - r, scaledX))
          : scaledX,
        y: this.options.boundingBox
          ? Math.max(r, Math.min(height - r, scaledY))
          : scaledY
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
          .attr(
            'x',
            (d) =>
              this.getNodeCoords(d).x +
              this.scaleNodeSize(d._absoluteFrequency) +
              2
          )
          .attr('y', (d) => this.getNodeCoords(d).y + r / 2);
    },
    zoom(event) {
      if (event.sourceEvent !== null && event.sourceEvent.type === 'wheel') {
        this.scroll(event.sourceEvent, 'network-' + this.pane);
      }
      this.transform = event.transform;
      this.applyScaleAndTransform();
    },
    updateSimulation() {
      const options = this.options;
      const width = options.size.w;
      const height = options.size.h;
      if (width <= 0 || height <= 0) return;
      this.nodes = this.netNodes.map((d) => Object.create(d));
      this.links = this.netLinks.map((d) => {
        return { source: d.sid, target: d.tid, similarity: d.similarity };
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
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));
      this.simulation.on('tick', () => {
        this.applyScaleAndTransform();
      });
    },
    dragstarted(event, d) {
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = this.transform.invertX(event.x);
      d.fy = this.transform.invertY(event.y);
      this.dragStart(event.sourceEvent);
    },

    dragged(event, d) {
      d.fx = this.transform.invertX(event.x);
      d.fy = this.transform.invertY(event.y);
    },

    dragended(event) {
      if (!event.active) this.simulation.alphaTarget(0);
      this.dragEnd(event.sourceEvent, this.pane + '-node');
    },
    getLineColor(node) {
      if (node._pane === 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane === 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
    resetZoomAndPan() {
      this.transform.x = 0;
      this.transform.y = 0;
      this.transform.k = 1;
      this.applyScaleAndTransform();
    }
  },
  mounted() {
    this.initNetwork();
  },
  beforeDestroy() {
    this.deselectAllNodes();
  }
};
</script>
<style>
svg .labels text {
  cursor: default;
}

.controls-container,
.checkbox-container {
  position: absolute;
  background: rgba(255, 255, 255, 1);
  right: 0;
  margin-right: 1.2em;
}
.checkbox-container {
  padding-top: 0.5em;
  padding-right: 0.5em;
}
.controls-container {
  bottom: 0.2em;
}
</style>
