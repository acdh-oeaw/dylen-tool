<template>
  <svg
    ref="svg"
    class="parallel-coordinates"
    :viewBox="viewBox"
  >
    <g>
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
      <g class="x_axis"></g>
      <g class="y_axis">
        <g
          v-for="scale in Object.entries(scaleY)"
          :key="scale[0]"
          v-axis:y="scale[1]"
          :transform="`translate(${scaleX(scale[0])},0)`"
        ></g>
        <text
          v-for="scale in Object.entries(scaleY)"
          :key="scale[0]"
          :transform="`translate(${scaleX(scale[0])},${scale[1].range()[0]+12})`"
          style="text-anchor: middle;"
          font-size="8"
        >{{scale[0]}}</text>
      </g>
      <g class="labels">
        <text
          v-for="node in netNodes"
          :key="node.id"
          fill="black"
          font-size="8"
          :x="scaleX(Object.keys(scaleY)[0])-4"
          :y="Object.values(scaleY)[0](node._metrics[Object.keys(scaleY)[0]])+4"
          style="text-anchor: end;"
        >{{node.name}}</text>
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
      svgPadding: {
        top: 10,
        right: 40,
        bottom: 15,
        left: 40,
      },
    };
  },
  computed: {
    viewBox() {
      return `0 0 ${this.options.size.w} ${this.options.size.h}`;
    },
    chartSize() {
      return [
        this.options.size.w - this.svgPadding.right,
        this.options.size.h - this.svgPadding.bottom,
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
    },
  },
  methods: {
    generateLine(node) {
      return this.lineGenerator(Object.entries(node._metrics));
    },
  },
  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis];
      const methodArg = binding.value;
      console.log(el);
      d3.select(el).call(
        d3[axisMethod](methodArg).tickValues([
          methodArg.domain()[0],
          methodArg.domain()[1],
        ])
      );
    },
  },
};
</script>

<style scoped>
</style>