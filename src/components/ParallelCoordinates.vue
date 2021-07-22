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
          v-for="node in netNodes.slice().sort((a,b) => hoverNodes.indexOf(a)-hoverNodes.indexOf(b))"
          :key="node.id + node._pane"
          :d="generateLine(node)"
          fill="none"
          :stroke="`${getLineColor(node)}${hoverNodes.indexOf(node) >= 0 ? 'ff' : '99'}`"
          :stroke-width="hoverNodes.indexOf(node) >= 0 ? 4 : 1"
          @mouseenter="(e) => onMouseEnter(e, node)"
          @mouseleave="(e) => onMouseLeave(e, node)"
        />
      </g>
      <g class="x_axis"></g>

      <g class="labels left">
        <g
          v-for="(nodeGroup, idx) in Object.values(groupedNodesPane1)"
          :key="idx + ' label left'"
        >
          <rect
            x="0"
            :width="scaleX(Object.keys(scaleY)[0])"
            :y="Object.values(scaleY)[0](Object.keys(groupedNodesPane1)[idx])-8"
            height="16"
            :fill="nodeGroup.find(node => hoverNodes.indexOf(node) >= 0) ? 'white' : 'none'"
          />
          <text
            font-size="12"
            fill="black"
            :x="scaleX(Object.keys(scaleY)[0])-8"
            :y="Object.values(scaleY)[0](Object.keys(groupedNodesPane1)[idx])+4"
            style="text-anchor: end;"
          >
            <tspan
              dx="0.25em"
              v-for="node in nodeGroup"
              :key="idx+node.id"
              :stroke="hoverNodes.indexOf(node) >= 0 ? 'black' : 'none'"
              @mouseenter="(e) => onMouseEnter(e, node)"
              @mouseleave="(e) => onMouseLeave(e, node)"
            >{{hoverNodes.indexOf(node) >= 0 || nodeGroup.length == 1 ? node.name : "×"}}</tspan>
          </text>
        </g>
      </g>
      <g class="labels right">
        <g
          v-for="(nodeGroup, idx) in Object.values(groupedNodesPane2)"
          :key="idx + ' label right'"
        >
          <rect
            :x="scaleX(Object.keys(scaleY)[Object.keys(scaleY).length -1])"
            :width="options.size.w-scaleX(Object.keys(scaleY)[Object.keys(scaleY).length -1])"
            :y="Object.values(scaleY)[Object.keys(scaleY).length -1](Object.keys(groupedNodesPane2)[idx])-6"
            height="12"
            :fill="nodeGroup.find(node => hoverNodes.indexOf(node) >= 0) ? 'white' : 'none'"
          />
          <text
            font-size="12"
            fill="black"
            :x="scaleX(Object.keys(scaleY)[Object.keys(scaleY).length -1])+2"
            :y="Object.values(scaleY)[Object.keys(scaleY).length -1](Object.keys(groupedNodesPane2)[idx])+4"
            style="text-anchor: start;"
          >
            <tspan
              dx="0.25em"
              v-for="node in nodeGroup"
              :key="idx+node.id"
              :stroke="hoverNodes.indexOf(node) >= 0 ? 'black' : 'none'"
              @mouseenter="(e) => onMouseEnter(e, node)"
              @mouseleave="(e) => onMouseLeave(e, node)"
            >{{hoverNodes.indexOf(node) >= 0 || (nodeGroup.length == 1 && nonOverlappingNodesRight.indexOf(node) >= 0) ? node.name : "×"}}</tspan>
          </text>
        </g>
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
      hoverNodes: [],
      svgPadding: {
        top: 20,
        right: 120,
        bottom: 50,
        left: 120,
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
    groupedNodesPane1() {
      let nodeGroup = {};
      this.netNodes
        .filter((n) => n._pane == 'pane1')
        .forEach((n) => {
          let nodeVal = n._metrics[Object.keys(this.scaleY)[0]];
          if (!(nodeVal in nodeGroup)) nodeGroup[nodeVal] = [];
          nodeGroup[nodeVal].push(n);
        });
      return nodeGroup;
    },
    groupedNodesPane2() {
      let nodeGroup = {};
      this.netNodes
        .filter((n) => n._pane == 'pane2')
        .forEach((n) => {
          let nodeVal =
            n._metrics[
              Object.keys(this.scaleY)[Object.values(this.scaleY).length - 1]
            ];
          if (!(nodeVal in nodeGroup)) nodeGroup[nodeVal] = [];
          nodeGroup[nodeVal].push(n);
        });
      return nodeGroup;
    },
    /* nonOverlappingNodesLeft() {
      return this.netNodes.filter(
        (node) =>
          this.netNodes
            .filter((n) => n._pane == 'pane1')
            .filter((n) => {
              let nodeVal = Object.values(this.scaleY)[0](
                node._metrics[Object.keys(this.scaleY)[0]]
              );
              let nVal = Object.values(this.scaleY)[0](
                n._metrics[Object.keys(this.scaleY)[0]]
              );
              return nodeVal + 7 >= nVal && nodeVal - 7 <= nVal;
            }).length == 1
      );
    }, */
    nonOverlappingNodesRight() {
      return this.netNodes.filter(
        (node) =>
          this.netNodes
            .filter((n) => n._pane == 'pane2')
            .filter((n) => {
              let nodeVal = Object.values(this.scaleY)[
                Object.values(this.scaleY).length - 1
              ](
                node._metrics[
                  Object.keys(this.scaleY)[
                    Object.values(this.scaleY).length - 1
                  ]
                ]
              );
              let nVal = Object.values(this.scaleY)[
                Object.values(this.scaleY).length - 1
              ](
                n._metrics[
                  Object.keys(this.scaleY)[
                    Object.values(this.scaleY).length - 1
                  ]
                ]
              );
              return nodeVal + 7 >= nVal && nodeVal - 7 <= nVal;
            }).length == 1
      );
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
    onMouseEnter(e, node) {
      if (this.hoverNodes.indexOf(node) < 0) this.hoverNodes.push(node);
    },
    onMouseLeave(e, node) {
      if (this.hoverNodes.indexOf(node) >= 0)
        this.hoverNodes.splice(this.hoverNodes.indexOf(node), 1);
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