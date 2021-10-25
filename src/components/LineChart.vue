<template>
  <svg
    ref='svg'
    class='line-chart'
    :viewBox='viewBox'
    data-sauto-id='line-chart'
  >
    <g class="legend">
      <g
        v-for='(targetword, idx) in data'
        :key='`legend${idx}`'
        :stroke="colors[idx]"
        :transform="`translate(${chartSize[0]}, ${20*(idx+1)})`"
      >
        <!-- <circle
          :fill="colors[idx]"
          r="6"
          cx="10"
        /> -->
        <text
          text-anchor="end"
          alignment-baseline="middle"
          style="font-weight: normal;"
        >Targetword {{idx}}</text>
      </g>
    </g>
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
    <rect
      fill="none"
      style="pointer-events: all;"
      :width="options.size.w"
      :height="options.size.h"
      @mouseover="mouseover"
      @mousemove="mousemove"
      @mouseout="mouseout"
    >
    </rect>
    <g
      v-for='(_, idx) in data'
      :key="`indicator${idx}`"
    >
      <circle
        :ref="`focus${idx}`"
        fill="none"
        :stroke="colors[idx]"
        r="7"
        style="opacity: 0;"
      ></circle>
      <text
        :ref="`focusText${idx}`"
        text-anchor="start"
        alignment-baseline="middle"
        style="opacity: 0;"
      ></text>
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
        right: 15,
        bottom: 50,
        left: 40
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
        .domain([...Array(this.data[0].length).keys()].map((val) => val))
        .range([this.svgPadding.left, this.chartSize[0]]);
    },
    lineGenerator() {
      return d3
        .line()
        .x((_, idx) => this.scaleX(idx))
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
    },
    mouseover() {
      this.data.forEach((_, idx) => {
        d3.select(this.$refs[`focus${idx}`][0]).style('opacity', 1);
        d3.select(this.$refs[`focusText${idx}`][0]).style('opacity', 1);
      });
    },
    mousemove(event) {
      var xPos = d3.pointer(event)[0];
      var domain = this.scaleX.domain();
      var range = this.scaleX.range();
      var rangePoints = d3.range(range[0], range[1], this.scaleX.step());
      var x0 = domain[d3.bisect(rangePoints, xPos)];
      if (x0 != undefined && x0 >= 0)
        this.data.forEach((_, idx) => {
          let selectedData = this.data[idx][x0];
          d3.select(this.$refs[`focus${idx}`][0])
            .attr('cx', this.scaleX(x0))
            .attr('cy', this.scaleY(selectedData));
          d3.select(this.$refs[`focusText${idx}`][0])
            .html(
              'year: ' +
                (1996 + x0) +
                ' - ' +
                'value: ' +
                Math.round(selectedData * 100) / 100
            )
            .attr('x', this.scaleX(x0) + 15)
            .attr('y', this.scaleY(selectedData))
            .attr('text-anchor', 'start');
          if (x0 > this.data[idx].length / 2)
            d3.select(this.$refs[`focusText${idx}`][0])
              .attr('text-anchor', 'end')
              .attr('x', this.scaleX(x0) - 15);
        });
    },
    mouseout() {
      this.data.forEach((_, idx) => {
        d3.select(this.$refs[`focus${idx}`][0]).style('opacity', 1);
        d3.select(this.$refs[`focusText${idx}`][0]).style('opacity', 1);
      });
    }
  },
  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis];
      const tickFilter = { x: (d) => d % 2 == 0, y: false }[axis];
      const tickFormat = { x: (d) => d + 1996, y: (d) => d }[axis];
      const methodArg = binding.value;
      d3.select(el).call(
        d3[axisMethod](methodArg)
          .tickValues(
            tickFilter
              ? methodArg.domain().filter(tickFilter)
              : methodArg.ticks()
          )
          .tickFormat(tickFormat)
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

.line-chart .y_axis .tick text {
  transform: translate(0px, 0px);
  text-anchor: end;
  font-weight: normal;
  font-size: 14px;
}

.line-chart .x_axis .tick text {
  font-size: 14px;
}
</style>
