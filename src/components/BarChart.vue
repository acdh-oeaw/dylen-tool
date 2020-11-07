<template>
  <div class="vis-component" ref="chart">
    <svg id="main-svg" :width="svgWidth" :height="svgHeight">
    <g class="chart-group" ref="chartGroup">
        <g class="axis axis-x" ref="axisX"></g>
        <g class="axis axis-y" ref="axisY"></g>
        <g class="bars-group" ref="barsGroup"></g>
      </g>
    </svg>
  </div>
</template>

<script>

import * as d3 from 'd3';

export default {
  name: 'BarChart',
  props: {
  },
  data() {
    return {
      svgWidth: 0,
      svgHeight: 500,
      svgPadding: {
        top: 25, right: 20, bottom: 70, left: 40,
      },
    }
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      d3.select(this.$refs.chartGroup)
        .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);
      this.drawXAxis();
      this.drawYAxis();
      this.drawBars();
    },
    drawXAxis() {
      d3.select(this.$refs.axisX)
        .attr('transform', `translate( 0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom} )`)
        .call(d3.axisBottom(this.xScale))
        .selectAll('text')
        .attr('y', 0)
        .attr('x', -7)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'end');
    },
    drawYAxis() {
      d3.select(this.$refs.axisY)
        .call(d3.axisLeft(this.yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end') 
        .attr('fill', 'black')
        .text('Burglary Rate (per 100.000 people)');
    },
    drawBars() {
      const barsGroup = d3.select(this.$refs.barsGroup);
      barsGroup.selectAll('.bar')
        .data(this.burglaryRates)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d) => this.xScale(d.state))
        .attr('y', (d) => this.yScale(d.value))
        .attr('width', this.xScale.bandwidth())
        .attr('height', (d) => this.svgHeight - this.svgPadding.top - this.svgPadding.bottom - this.yScale(d.value))
        .on('click', (d) => this.handleBarClick(d.state));
    },
    handleBarClick(val) {
      this.$store.commit('changeSelectedState', val);
    }
  },
  computed: {
    burglaryRates: {
      get() {
        return this.$store.getters.burglaryRates;
      }
    },
    dataMax() {
      return d3.max(this.burglaryRates, (d) => d.value);
    },
    dataMin() {
      return d3.min(this.burglaryRates, (d) => d.value);
    },
    xScale() {
      return d3.scaleBand()
        .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]).padding(0.1)
        .domain(this.burglaryRates.map((d) => d.state));
    },
    yScale() {
      return d3.scaleLinear()
        .rangeRound([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
        .domain([this.dataMin > 0 ? 0 : this.dataMin, this.dataMax]);
    },
  },
  watch: {
    burglaryRates: {
      handler() {
        this.drawChart();
      },
      deep: true,
    },
  },
}
</script>

<style>
.bar {
  fill: steelblue;
}

.bar:hover {
  fill: lightblue;
}
</style>
