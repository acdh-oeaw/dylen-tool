<template>
  <svg
    ref="svg"
    class="parallel-coordinates"
    :viewBox="viewBox"
  >
    <g>
      <g class="x_axis"></g>
      <g class="y_axis"></g>
      <g class="labels"></g>
      <g class="lines">
        <path
          v-for="node in netNodes"
          :key="node.id"
          :d="generateLine(node)"
          fill="none"
          stroke="black"
          stroke-width="1"
        />
      </g>
    </g>
  </svg>
</template>
<script>
import * as d3 from 'd3';
export default {
  name: 'ParallelCoordinates',
  props: ['netNodes', 'options'],
  data() {
    return {
      svgPadding: 30,
    };
  },
  computed: {
    viewBox() {
      return `0 0 ${this.options.size.w} ${this.options.size.h}`;
    },
    chartSize() {
      return [
        this.options.size.w - this.svgPadding,
        this.options.size.h - this.svgPadding,
      ];
    },
    metrics() {
      return [
        ...new Set(this.netNodes.map((n) => Object.keys(n._metrics)).flat()),
      ];
    },
    scaleY() {
      let scale = {};
      this.metrics.forEach((metric) => {
        scale[metric] = d3
          .scaleLinear()
          .domain([
            d3.min(this.netNodes, (entry) => entry._metrics[metric]),
            d3.max(this.netNodes, (entry) => entry._metrics[metric]),
          ])
          .range([this.chartSize[1], this.svgPadding]);
      });
      return scale;
    },
    scaleX() {
      return d3
        .scalePoint()
        .domain(this.metrics)
        .range([this.svgPadding, this.chartSize[0]]);
    },
    lineGenerator() {
      return d3
        .line()
        .x((d) => this.scaleX(d[0]))
        .y((d) => this.scaleY[d[0]](d[1]))
        .curve(d3.curveCardinal.tension(0.75));
    },
  },
  methods: {
    generateLine(node) {
      return this.lineGenerator(Object.entries(node._metrics));
    },
  },
};
</script>

<style scoped>
</style>