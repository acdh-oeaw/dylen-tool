<template>
  <svg
    ref='svg'
    class='line-chart'
    :viewBox='viewBox'
    data-sauto-id='line-chart'
  >

  </svg>
</template>
<script>
import * as d3 from 'd3';

export default {
  name: 'LineChart',
  props: ['netNodes', 'options'],
  data() {
    return {
      hoverNodes: [],
      svgPadding: {
        top: 20,
        right: 120,
        bottom: 50,
        left: 120
      }
    };
  },
  computed: {
    viewBox() {
      return `0 0 ${this.options.size.w} ${this.options.size.h}`;
    },
    chartSize() {
      return [
        this.options.size.w - this.svgPadding.right,
        this.options.size.h - this.svgPadding.bottom
      ];
    },
    scaleY() {
      let scale = {};
      this.metrics.forEach((metric) => {
        scale[metric] = d3
          .scaleLinear()
          .domain([
            0,
            /* d3.min(this.netNodes, (entry) => entry._metrics[metric]) * 0.9, */
            d3.max(this.netNodes, (entry) => entry._metrics[metric]) * 1.1
          ])
          .range([this.chartSize[1], this.svgPadding.top]);
      });
      return scale;
    },
    scaleX() {
      return d3
        .scalePoint()
        .domain(this.metrics)
        .range([this.svgPadding.left, this.chartSize[0]]);
    },
    lineGenerator() {
      return d3
        .line()
        .x((d) => this.scaleX(d[0]))
        .y((d) => this.scaleY[d[0]](d[1]));
      //.curve(d3.curveCardinal.tension(0.75));
    }
  },
  methods: {
    generateLine(node) {
      return this.lineGenerator(Object.entries(node._metrics));
    },
    getLineColor(node) {
      if (node._pane == 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane == 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
    onMouseEnter(e, node) {
      if (this.hoverNodes.indexOf(node) < 0) this.hoverNodes.push(node);
    },
    onMouseLeave(e, node) {
      if (this.hoverNodes.indexOf(node) >= 0)
        this.hoverNodes.splice(this.hoverNodes.indexOf(node), 1);
    }
  },
  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis];
      const methodArg = binding.value;
      d3.select(el).call(
        d3[axisMethod](methodArg).tickValues([
          methodArg.domain()[0],
          methodArg.domain()[1]
        ])
      );
    }
  }
};
</script>

<style>
.y_axis path,
.y_axis line {
  stroke: #ccc;
}

.y_axis .tick text {
  transform: translate(9px, -6px);
  text-anchor: middle;
  font-weight: bold;
}
</style>
