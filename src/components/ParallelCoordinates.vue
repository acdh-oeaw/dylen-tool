<template>
  <svg
    ref="svg"
    class="parallel-coordinates"
    :viewBox="viewBox"
  >
    <g>
      <g
        class="grid"
        v-if="netNodes.length > 0"
      >
        <line
          v-for="i in 10"
          :key="`horizontal${i}`"
          :x1="scaleX.range()[0]"
          :x2="scaleX.range()[1]"
          :y1="svgPadding.top + (i-1)*(chartSize[1]-svgPadding.top)/9"
          :y2="svgPadding.top + (i-1)*(chartSize[1]-svgPadding.top)/9"
          stroke-width="1"
          stroke="#ccc"
        />
      </g>
      <g class="y_axis">
        <g
          v-for="scale in Object.entries(scaleY)"
          :key="scale[0]"
        >
          <g
            v-axis:y="scale[1]"
            :transform="`translate(${scaleX(scale[0])},0)`"
          ></g>
          <text
            :transform="`translate(${scaleX(scale[0])},${scale[1].range()[0]+12})`"
            style="text-anchor: middle;"
            font-size="12"
            fill="black"
            font-weight="bold"
          >
            <tspan
              v-for="(line, idx) in camelCaseToSpaces(scale[0]).split(' ')"
              :key="line"
              x="0"
              :dy="idx == 0 ? '1em' : '1.2em'"
            >{{line}}</tspan>
          </text>
        </g>
      </g>
      <g class="lines">
        <path
          v-for="node in netNodes"
          :key="node.id + node._pane"
          :d="generateLine(node)"
          fill="none"
          :stroke="getLineColor(node)"
          stroke-width="1"
        />
      </g>
      <g class="x_axis"></g>

      <g class="labels">
        <text
          v-for="node in netNodes"
          :key="node.id + node._pane + 'label'"
          fill="black"
          font-size="12"
          :x="scaleX(Object.keys(scaleY)[0])-4"
          :y="Object.values(scaleY)[0](node._metrics[Object.keys(scaleY)[0]])+4"
          style="text-anchor: end;"
        >
          <tspan dy="0em">{{node.name}}</tspan>
        </text>
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
      lineColors: ['blue', 'red'],
      svgPadding: {
        top: 20,
        right: 50,
        bottom: 50,
        left: 100,
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
            0,
            /* d3.min(this.netNodes, (entry) => entry._metrics[metric]) * 0.9, */
            d3.max(this.netNodes, (entry) => entry._metrics[metric]) * 1.1,
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
    camelCaseToSpaces(text) {
      let result = text.replace(/([A-Z])/g, ' $1');
      return result.charAt(0).toUpperCase() + result.slice(1);
    },
    getLineColor(node) {
      if (node._pane == 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane == 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
  },
  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis];
      const methodArg = binding.value;
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