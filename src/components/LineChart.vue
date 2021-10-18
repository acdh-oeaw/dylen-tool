<template>
  <svg
    ref='svg'
    class='line-chart'
    :viewBox='viewBox'
    data-sauto-id='line-chart'
  >
    <g class='y_axis'>
      <g
        v-axis:y='scaleY'
        :transform='`translate(${svgPadding.left},0)`'
      ></g>
    </g>
    <g class='x_axis'>
      <g
        v-axis:x='scaleX'
        :transform='`translate(0,${chartSize[1]})`'
      ></g>
    </g>
    <g class='lines'>
      <path
        v-for='(targetword, idx) in data'
        :key='`timeSeries${idx}`'
        :d='generateLine(targetword)'
        fill='none'
        :stroke="colors[idx]"
      />
    </g>
  </svg>
</template>
<script>
import * as d3 from 'd3';

export default {
  name: 'LineChart',
  props: ['data', 'options', 'colors'],
  data() {
    return {
      hoverNodes: [],
      svgPadding: {
        top: 20,
        right: 5,
        bottom: 50,
        left: 10
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
      return d3
        .scaleLinear()
        .domain([
          /* d3.min(this.netNodes, (entry) => entry._metrics[metric]) * 0.9, */
          d3.min(this.data.flat(), (e) => e) * 0.9,
          d3.max(this.data.flat(), (e) => e) * 1.1
        ])
        .range([this.chartSize[1], this.svgPadding.top]);
    },
    scaleX() {
      return d3
        .scalePoint()
        .domain([...Array(this.data[0].length).keys()].map((val) => val + 1997))
        .range([this.svgPadding.left, this.chartSize[0]]);
    },
    lineGenerator() {
      return d3
        .line()
        .x((_, idx) => this.scaleX(idx + 1997))
        .y((d) => this.scaleY(d))
        .curve(d3.curveCardinal.tension(0.5));
    }
  },
  methods: {
    generateLine(targetword) {
      return this.lineGenerator(targetword);
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
      const tickFilter = { x: (d) => d % 2 == 0, y: false }[axis];
      const methodArg = binding.value;
      d3.select(el).call(
        d3[axisMethod](methodArg).tickValues(
          tickFilter ? methodArg.domain().filter(tickFilter) : methodArg.ticks()
        )
      );
    }
  }
};
</script>

<style>
.y_axis path,
.x_axis path,
.y_axis line,
.x_axis line {
  stroke: #ccc;
}

.y_axis .tick text {
  transform: translate(9px, -6px);
  text-anchor: middle;
  font-weight: bold;
}
</style>
