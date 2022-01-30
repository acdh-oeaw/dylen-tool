<template>
  <svg
    ref='svg'
    class='parallel-coordinates'
    :viewBox='viewBox'
    data-sauto-id='parallel-coordinates'
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
      <g class='grid'>
        <line
          v-for='i in 10'
          :key='`horizontal${i}`'
          :x1='scaleX.range()[0]'
          :x2='scaleX.range()[1]'
          :y1='svgPadding.top + (i-1)*(chartSize[1]-svgPadding.top)/9'
          :y2='svgPadding.top + (i-1)*(chartSize[1]-svgPadding.top)/9'
          stroke-width='1'
          stroke='#ccc'
        />
      </g>
      <g class='y_axis'>
        <g
          v-for='scale in Object.entries(scaleY)'
          :key='scale[0]'
        >
          <g
            v-axis:y='scale[1]'
            :transform='`translate(${scaleX(scale[0])},0)`'
          ></g>
          <text
            :transform='`translate(${scaleX(scale[0])},${scale[1].range()[0]}) rotate(-45)`'
            style='text-anchor: end;'
            font-size='10'
            fill='black'
            font-weight='bold'
          >
            <tspan
              v-for="line in camelCaseToSpaces(scale[0]).split(' ')"
              :key='line'
              x='0'
              dy="1em"
            >
              {{ line }}
            </tspan>
          </text>
        </g>
      </g>
      <g class='lines'>
        <path
          v-for='node in selectedNodes.slice().sort((a,b) => hoverNodes.indexOf(a)-hoverNodes.indexOf(b))'
          :key='node.id + node._pane'
          :d='generateLine(node)'
          fill='none'
          :stroke="`${getLineColor(node)}${hoverNodes.indexOf(node) >= 0 ? 'ff' : '99'}`"
          :stroke-width='hoverNodes.indexOf(node) >= 0 ? 4 : 1'
          @mouseenter='(e) => {onMouseEnter(e, node); mouseOver(e, "parallel-coordinates-line")}'
          @mouseleave='(e) => onMouseLeave(e, node)'
        />
      </g>
      <g class='x_axis'></g>

      <g class='labels left'>
        <g
          v-for='(nodeGroup, idx) in Object.values(groupedNodesPane1)'
          :key="idx + ' label left'"
        >
          <rect
            x='0'
            :width='scaleX(Object.keys(scaleY)[0])'
            :y='Object.values(scaleY)[0](Object.keys(groupedNodesPane1)[idx])-6'
            height='12'
            :fill="nodeGroup.find(node => hoverNodes.indexOf(node) >= 0) ? 'white' : 'none'"
          />
          <text
            v-for='(node, nodeIdx) in nodeGroup'
            :key='idx+node.id'
            font-size='12'
            fill='black'
            :x='scaleX(Object.keys(scaleY)[0]) - 8 - (nodeGroup.length-1) * 12 + nodeIdx*12'
            :y='Object.values(scaleY)[0](Object.keys(groupedNodesPane1)[idx])+4 '
            style='text-anchor: end;'
            :filter="hoverNodes.indexOf(node) >= 0 ? 'url(#solid)' : ''"
          >
            <tspan
              dx='0.25em'
              dy='6'
              :stroke="hoverNodes.indexOf(node) >= 0 ? 'black' : 'none'"
              @mouseenter='(e) => onMouseEnter(e, node, !(hoverNodes.indexOf(node) >= 0 || (nodeGroup.length === 1 && nonOverlappingNodesLeft.indexOf(node) >= 0)))'
              @mouseleave='(e) => onMouseLeave(e, node)'
              data-sauto-id='parallel-coordinates-label'
            >
              {{
                hoverNodes.indexOf(node) >= 0 ||
                (nodeGroup.length === 1 && nonOverlappingNodesLeft.indexOf(node) >= 0) ? node.name : '*'
              }}
            </tspan>
            <tspan
              dy='-6'
              font-size='8'
              style='cursor: pointer'
              @click='deselectNode(node)'
              @mouseenter='(e) => onMouseEnter(e, node)'
              @mouseleave='(e) => onMouseLeave(e, node)'
              data-sauto-id='parallel-coordinates-x-button'
            >
              {{
                hoverNodes.indexOf(node) >= 0 ||
                (nodeGroup.length === 1 && nonOverlappingNodesLeft.indexOf(node) >= 0) ? '❌' : ''
              }}
              <title>Deselect</title>
            </tspan>
            <!-- </g> -->
          </text>
        </g>
      </g>
      <g class='labels right'>
        <g
          v-for='(nodeGroup, idx) in Object.values(groupedNodesPane2)'
          :key="idx + ' label right'"
        >
          <rect
            :x='scaleX(Object.keys(scaleY)[Object.keys(scaleY).length -1])'
            :width='options.size.w-scaleX(Object.keys(scaleY)[Object.keys(scaleY).length -1])'
            :y='Object.values(scaleY)[Object.keys(scaleY).length -1](Object.keys(groupedNodesPane2)[idx])-6'
            height='12'
            :fill="nodeGroup.find(node => hoverNodes.indexOf(node) >= 0) ? 'white' : 'none'"
          />
          <text
            v-for='(node, nodeIdx) in nodeGroup'
            :key='idx+node.id'
            font-size='12'
            fill='black'
            :x='scaleX(Object.keys(scaleY)[Object.keys(scaleY).length -1])+2+(nodeGroup.length -1)*12-nodeIdx*12'
            :y='Object.values(scaleY)[Object.keys(scaleY).length -1](Object.keys(groupedNodesPane2)[idx])+4'
            style='text-anchor: start;'
            :filter="hoverNodes.indexOf(node) >= 0 ? 'url(#solid)' : ''"
          >
            <tspan
              dx='0.25em'
              :stroke="hoverNodes.indexOf(node) >= 0 ? 'black' : 'none'"
              @mouseenter='(e) => onMouseEnter(e, node, !(hoverNodes.indexOf(node) >= 0 || (nodeGroup.length === 1 && nonOverlappingNodesRight.indexOf(node) >= 0)))'
              @mouseleave='(e) => onMouseLeave(e, node)'
              data-sauto-id='parallel-coordinates-label'
            >
              {{ hoverNodes.indexOf(node) >= 0 ||
            (nodeGroup.length === 1 && nonOverlappingNodesRight.indexOf(node) >= 0) ? node.name : '*'
              }}
            </tspan>
            <tspan
              dy='-6'
              font-size='8'
              style='cursor: pointer'
              @click='deselectNode(node)'
              @mouseenter='(e) => onMouseEnter(e, node)'
              @mouseleave='(e) => onMouseLeave(e, node)'
              data-sauto-id='parallel-coordinates-x-button'
            >
              {{ hoverNodes.indexOf(node) >= 0 ||
            (nodeGroup.length == 1 && nonOverlappingNodesRight.indexOf(node) >= 0) ? '❌' : '' }}
              <title>Deselect</title>
            </tspan>
          </text>
        </g>
      </g>
      <g class='targetwordLabels'>
        <g v-if="targetWordLabelLeft.text !== ''">
          <text
            :y='svgPadding.top - 20'
            :x='2'
            text-anchor='start'
            :fill='targetWordLabelLeft.color'
          >
            <tspan>{{ targetWordLabelLeft.text }}</tspan>
            <tspan dx='2'>({{ targetWordLabelLeft.year }})</tspan>
          </text>
          <line
            x1='0'
            :x2='svgPadding.left'
            :y1='svgPadding.top'
            :y2='svgPadding.top'
            :stroke='targetWordLabelLeft.color'
            stroke-width='1'
          />
          <text
            id='selectAll'
            :y='svgPadding.top - 3'
            :x='2'
            text-anchor='start'
            fill='#3161F5'
            @click="selectAllNodes('pane1')"
            data-sauto-id='parallel-coordinates-selectAll-pane1'
          >
            <tspan>select all</tspan>
          </text>
          <text
            :y='svgPadding.top - 3'
            :x='52'
            text-anchor='start'
          >
            <tspan> |</tspan>
          </text>
          <text
            id='deselectAll'
            :y='svgPadding.top - 3'
            :x='60'
            text-anchor='start'
            fill='#3161F5'
            @click="deselectAllNodes('pane1')"
            data-sauto-id='parallel-coordinates-deselectAll-pane1'
          >
            <tspan>deselect all</tspan>
          </text>
        </g>
        <g v-if="targetWordLabelRight.text !== ''">
          <text
            :y='svgPadding.top - 20'
            :x='chartSize[0]+svgPadding.right'
            text-anchor='end'
            :fill='targetWordLabelRight.color'
          >
            <tspan>{{ targetWordLabelRight.text }}</tspan>
            <tspan dx='2'>({{ targetWordLabelRight.year }})</tspan>
          </text>
          <text
            id='selectAll'
            :y='svgPadding.top - 3'
            :x='chartSize[0]+svgPadding.right - 120'
            text-anchor='start'
            fill='#3161F5'
            @click="selectAllNodes('pane2')"
            data-sauto-id='parallel-coordinates-selectAll-pane2'
          >
            <tspan>select all</tspan>
          </text>
          <text
            :y='svgPadding.top - 3'
            :x='chartSize[0]+svgPadding.right - 67'
            text-anchor='start'
          >
            <tspan> |</tspan>
          </text>
          <text
            id='deselectAll'
            :y='svgPadding.top - 3'
            :x='chartSize[0]+svgPadding.right - 60'
            text-anchor='start'
            fill='#3161F5'
            @click="deselectAllNodes('pane2')"
            data-sauto-id='parallel-coordinates-deselectAll-pane2'
          >
            <tspan>deselect all</tspan>
          </text>
          <line
            :x1='chartSize[0]'
            :x2='chartSize[0]+svgPadding.right'
            :y1='svgPadding.top'
            :y2='svgPadding.top'
            :stroke='targetWordLabelRight.color'
            stroke-width='1'
          />
        </g>
      </g>
      <g class="metricLabels"></g>
    </g>
  </svg>
</template>
<script>
import * as d3 from 'd3';
import { camelCaseToSpaces, roundToMaxDigit } from '@/helpers/utils';

import {
  networkTypeMixin,
  EGO_NETWORK,
  GENERAL_PARTY,
  GENERAL_SPEAKER
} from '@/helpers/mixins';

export default {
  mixins: [networkTypeMixin],
  name: 'ParallelCoordinates',
  props: ['allNodes', 'selectedNodes', 'options'],
  data() {
    return {
      svgPadding: {
        top: 35,
        right: 140,
        bottom: 55,
        left: 140
      },
      camelCaseToSpaces: camelCaseToSpaces
    };
  },
  computed: {
    networkType() {
      return this.$store.getters['main/topNav'].networkType;
    },
    hoverNodes() {
      let sharedNode = this.$store.getters['main/focusNode'];
      return this.selectedNodes.filter((node) => sharedNode === node.id);
    },
    viewBox() {
      return `0 0 ${this.options.size.w} ${this.options.size.h}`;
    },
    chartSize() {
      return [
        this.options.size.w - this.svgPadding.right,
        this.options.size.h - this.svgPadding.bottom
      ];
    },
    metrics() {
      //logger.log(this.selectedNodes);
      return this.$store.getters['main/parallelCoordinateMetrics']
        .filter((m) => m.enabled)
        .map((m) => m.name);
    },
    scaleY() {
      let scale = {};
      this.metrics.forEach((metric) => {
        scale[metric] = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(
              this.selectedNodes.length > 0
                ? this.selectedNodes
                : this.allNodes,
              (entry) => entry._metrics[metric] || 0
            ) * 1.1
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
      this.selectedNodes
        .filter((n) => n._pane === 'pane1')
        .forEach((n) => {
          let nodeVal = n._metrics[Object.keys(this.scaleY)[0]];
          if (!(nodeVal in nodeGroup)) nodeGroup[nodeVal] = [];
          nodeGroup[nodeVal].push(n);
        });
      return nodeGroup;
    },
    groupedNodesPane2() {
      let nodeGroup = {};

      this.selectedNodes
        .filter((n) => n._pane === 'pane2')
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
    nonOverlappingNodesLeft() {
      return this.selectedNodes.filter(
        (node) =>
          this.selectedNodes
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
    },
    nonOverlappingNodesRight() {
      return this.selectedNodes.filter(
        (node) =>
          this.selectedNodes
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
    targetWordLabelLeft() {
      return this.getWordLabel(this.networkType, 'pane1');
    },
    targetWordLabelRight() {
      return this.getWordLabel(this.networkType, 'pane2');
    }
  },
  methods: {
    getWordLabel(networkType, pane) {
      switch (networkType) {
        case EGO_NETWORK:
          return {
            text: this.$store.getters['main/selectedTargetword'](pane).text,
            year: this.$store.getters['main/selectedYear'](pane)?.year,
            color: this.$store.getters['main/selectionColors'][pane==='pane1'? 0 : 1]
          };
        case GENERAL_PARTY:
          return {
            text: this.$store.getters['main/selectedGeneralNetworkParty'](pane)
              ? this.$store.getters['main/selectedGeneralNetworkParty'](pane)
                  .party
              : '',
            year: this.$store.getters['main/selectedGeneralNetworkParty'](pane)
              ? this.$store.getters['main/selectedGeneralNetworkParty'](pane)
                  .year
              : '',
            color: this.$store.getters['main/selectionColors'][0]
          };
        case GENERAL_SPEAKER:
          return {
            party: this.$store.getters['main/selectedGeneralNetworkSpeaker'](
              pane
            ).loaded
              ? this.$store.getters['main/selectedGeneralNetworkSpeakerParty'](
                  pane
                )
              : '',
            text: this.$store.getters['main/selectedGeneralNetworkSpeaker'](
              pane
            ).loaded
              ? this.$store.getters[
                  'main/selectedGeneralNetworkSpeakerSpeaker'
                ](pane)
              : '',
            year: this.$store.getters['main/selectedGeneralNetworkSpeaker'](
              pane
            ).loaded
              ? this.$store.getters['main/selectedGeneralNetworkSpeaker'](pane)
                  .network.year
              : '',
            color: this.$store.getters['main/selectionColors'][0]
          };
        default:
          return {};
      }
    },
    generateLine(node) {
      let data = this.metrics.map((m) => [m, node._metrics[m] || 0]);
      //logger.log(node, data);
      return this.lineGenerator(data);
    },

    getLineColor(node) {
      if (node._pane === 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane === 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
    onMouseEnter(e, node, sauto) {
      let sharedNode = this.$store.getters['main/focusNode'];
      if (sharedNode !== node.id) {
        this.$store.commit('main/addFocusNode', { node: node.id });
      }
      if (sauto) {
        this.mouseMove(e, 'parallel-coordinates-*');
      }
      d3.select('.metricLabels .infoLabels').remove();
      d3.select('.metricLabels')
        .append('g')
        .attr('class', 'infoLabels')
        .selectAll('text')
        .data(this.metrics)
        .join('text')
        .text((d) => roundToMaxDigit(node._metrics[d], 2))
        .attr('y', (d) => this.scaleY[d](node._metrics[d]) - 6)
        .attr('x', (d) => this.scaleX(d))
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('filter', 'url(#solid)');
    },
    mouseOver(e, sautoId) {
      this.mouseMove(e, sautoId);
    },
    onMouseLeave(e, node) {
      let sharedNode = this.$store.getters['main/focusNode'];
      if (sharedNode === node.id)
        this.$store.commit('main/removeFocusNode', { node: node.id });
      d3.select('.metricLabels .infoLabels').remove();
    },
    deselectNode(node) {
      this.$store.commit('main/removeSelectedNodeForNodeMetrics', node);
    },
    selectAllNodes(pane) {
      this.allNodes
        .filter(
          (node) =>
            node._pane === pane &&
            this.$store.getters['main/selectedNodesForMetrics'].findIndex(
              (n) => n.id === node.id
            ) === -1
        )
        .forEach((node) => {
          this.$store.commit('main/addSelectedNodeForNodeMetrics', node);
        });
    },
    deselectAllNodes(pane) {
      this.allNodes
        .filter(
          (node) =>
            node._pane === pane &&
            this.$store.getters['main/selectedNodesForMetrics'].findIndex(
              (n) => n.id === node.id
            ) > -1
        )
        .forEach((node) => {
          this.$store.commit('main/removeSelectedNodeForNodeMetrics', node);
        });
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

.targetwordLabels text {
  font-size: 10px;
  font-weight: bold;
}

#selectAll:hover {
  fill: red;
  cursor: pointer;
}

#deselectAll:hover {
  fill: red;
  cursor: pointer;
}
</style>
