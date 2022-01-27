<template>
  <b-row class='h-100'>
    <splitpanes
      :style="{height: maxHeight, width: '100%'}"
      :horizontal='mobile'
      @resized='resized("vertical")'
      @pane-maximize='resized'
    >
      <pane :size="(fullscreen['networkGraph1'] + fullscreen['networkGraph2']) ? 100 : (fullscreen['nodeMetrics'] + fullscreen['timeSeries']) ? 0 : 50">
        <splitpanes
          horizontal
          @resized='resized("left-horizontal")'
          @pane-maximize='resized'
        >
          <pane :size="(fullscreen['networkGraph1'] || !showSecondGraph)? 100 : fullscreen['networkGraph2'] ? 0 : 50">
            <info-icon
                size='1.2x'
                class='custom-class info-button ego-info-button'
                style='color:#17a2b8'
                data-sauto-id='ego-network-info-button'
                v-b-modal='"ego-info"'></info-icon>
            <setting
              position='result'
              setting-component='egoNetwork'
            ></setting>
            <button
              @click="(event) => toggleFullscreen('networkGraph1', event,'toggleFullScreenButton-pane1')"
              class='fullscreen-button'
              variant='light'
              data-sauto-id='ignore'
            >
              <b-icon :icon="fullscreen['networkGraph1'] ? 'fullscreen-exit' : 'arrows-fullscreen'"></b-icon>
            </button>

            <NetworkGraph
              v-if="!timeoutWarning1 && showFirstGraph && type === 'Ego'"
              ref='networkGraph1'
              pane='pane1'
            />
            <NetworkGraphGeneral
              v-if="!timeoutWarning1 && showFirstGraph && type === 'Party'"
              ref='networkGraph1'
              pane='pane1'
            />
            <NetworkGraphSpeaker
              v-if="!timeoutWarning1 && showFirstGraph && type === 'Speaker'"
              ref='networkGraph1'
              pane='pane1'
            />
          </pane>
          <pane
            v-if='showSecondGraph'
            :size="fullscreen['networkGraph2'] ? 100 : fullscreen['networkGraph1'] ? 0 : 50"
          >
            <button
              @click="(event) => toggleFullscreen('networkGraph2', event,'toggleFullScreenButton-pane2')"
              class='fullscreen-button'
              variant='light'
              data-sauto-id='ignore'
            >
              <b-icon :icon="fullscreen['networkGraph2'] ? 'fullscreen-exit' : 'arrows-fullscreen'"></b-icon>
            </button>
            <NetworkGraph
              v-if="!timeoutWarning2 && showSecondGraph && type === 'Ego'"
              ref='networkGraph2'
              pane='pane2'
            />
            <NetworkGraphGeneral
              v-if="!timeoutWarning2 && showSecondGraph && type === 'Party'"
              ref='networkGraph2'
              pane='pane2'
            />
            <NetworkGraphSpeaker
              v-if="!timeoutWarning2 && showSecondGraph && type === 'Speaker'"
              ref='networkGraph2'
              pane='pane2'
            />
          </pane>
        </splitpanes>
      </pane>
      <pane
        :size="(fullscreen['nodeMetrics'] + fullscreen['timeSeries']) ? 100 : (fullscreen['networkGraph1'] + fullscreen['networkGraph2']) ? 0 : 50"
        v-if='showFirstGraph || showSecondGraph'
      >
        <splitpanes
          horizontal
          @resized='resized("right-horizontal")'
          @pane-maximize='resized'
        >
          <pane :size="fullscreen['nodeMetrics'] ? 100 : fullscreen['timeSeries'] ? 0 : 50">
            <info-icon
                size='1.2x'
                class='custom-class info-button ego-info-button'
                style='color:#17a2b8'
                data-sauto-id='parallel-coordinates-info-button'
                v-b-modal='"pc-info"'></info-icon>
            <setting
              position='result'
              setting-component='nodeMetrics'
            ></setting>
            <button
              @click="(event) => toggleFullscreen('nodeMetrics', event,'toggleFullScreenButton-nodeMetrics')"
              class='fullscreen-button'
              variant='light'
              data-sauto-id='ignore'
            >
              <b-icon :icon="fullscreen['nodeMetrics'] ? 'fullscreen-exit' : 'arrows-fullscreen'"></b-icon>
            </button>
            <node-metrics ref='nodeMetrics'>
            </node-metrics>
          </pane>
          <pane :size="fullscreen['timeSeries'] ? 100 : fullscreen['nodeMetrics'] ? 0 : 50">
            <info-icon
                size='1.2x'
                class='custom-class info-button ts-info-button'
                style='color:#17a2b8'
                data-sauto-id='time-series-info-button'
                v-b-modal='"ts-info"'></info-icon>
            <button
              @click="(event) => toggleFullscreen('timeSeries', event,'toggleFullScreenButton-timeSeries')"
              class='fullscreen-button'
              variant='light'
              data-sauto-id='ignore'
            >
              <b-icon :icon="fullscreen['timeSeries'] ? 'fullscreen-exit' : 'arrows-fullscreen'"></b-icon>
            </button>
            <TimeSeries
              :panes="['pane1', 'pane2']"
              ref='timeSeries'
            >
            </TimeSeries>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
    <b-modal
        :id='"ego-info"'
        modal-class='guide'
        title='Ego Network interpretation guidelines'
        ok-only>
      <ul>
        <li>The targetword isn't shown in the visualised ego-network, since every node have a connection to
          the targetword and the network visualisation would be too unnecessarily complex.
        </li>
        <li>The <b>size of nodes</b> represents word frequency</li>
        <li>The <b>thickness of edges</b> represents the similarity of nodes</li>
        <li>The <b>colors of the labels</b> represent different Part-of-speech tags</li>
        <li>The <b>colors of the nodes</b> represent different clusters. Cluster visualization is disabled by default, it can be enbaled by clicking on the checkbox <code>"show clusters"</code></li>
      </ul>
    </b-modal>
    <b-modal
        xl='12'
        :id='"pc-info"'
        modal-class='guide'
        title='Node metrics comparison guidelines'
        ok-only>
      <p>
        The DYLEN Parallel coordinates visualization is able to display node metrics of all nodes from two different networks.
      </p>

      <h6><b>Axes</b></h6>
      <ul>
        <li>
          <code>x-axis</code> represents name of different node metrics, while the <code>y-axis</code> shows the metric values.
        </li>
        <li>
          5 from 10 available node metrics are visualized as default, more metrics can be added by clicking on the <code>settings</code> icon <b-icon
            icon='gear'></b-icon> and enabling the metrics from the <code>Axes to display</code> section. You can also change the order of the axes from settings
        </li>
      </ul>

      <h6><b>Network Labels</b></h6>
      <p>
        The labels of the first and the second network are shown in the top left and top right position of the chart respectively.
      </p>
      <h6><b>Node Labels</b></h6>
      <p>
        The node labels are shown on the left and right side of the chart, overlapping words(words having the same/similar metric value on the first/last axis ) are displayed as <code>*</code>, the actual word can be viewed by hovering over the <code>*</code> character
      </p>
      <h6><b>Select/Deselect nodes</b></h6>
      <p>
        Sometimes the number of nodes can make interpretation of parallel coordinates difficult. <br>
        You can use the <code>deselect all</code> button to remove all nodes and manually selecting the nodes to be shown
        from the <code>Network visualization</code> or from the <code>Table view</code><br>
        Individual nodes can be removed from the chart by clicking on the <code>'x'</code> icon, which appears when you hover over the node label.
      </p>
      <h6><b>Interactivity with Network Visualization</b></h6>
      <p>
        <code>Network visualization</code> and <code>Node metrics comparison</code> components share the same data. <br>
        When you hover over the lines in the <code>Parallel coordinates</code>, corresponding node and its neighbors will be emphasized in the <code>Network visualization</code> and vice versa.
      </p>
    </b-modal>
    <b-modal
        xl='12'
        :id='"ts-info"'
        modal-class='guide'
        title='Node metrics comparison guidelines'
        ok-only>
      <p>
        The DYLEN Time series Analysis component visualizes the change of (absolute) difference in the values of selected metrics to a specific target year.
      </p>
      <ol>
        <li>Select the metric you want to visualize from the <code>Metric dropdown selector</code></li>
        <li>Select the year you want to compare the metrics to.</li>
      </ol>

      <h6>Axes</h6>
      x-axis shows the years, while y-axis shows the value of the selected metrics

    </b-modal>
  </b-row>

</template>

<script>
import NetworkGraph from '@/components/NetworkGraph';
import NetworkGraphSpeaker from '@/components/NetworkGraphSpeaker';
import NetworkGraphGeneral from '@/components/NetworkGraphGeneral';
import NodeMetrics from '@/components/NodeMetrics';
import TimeSeries from '@/components/TimeSeries';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import Setting from '@/components/Setting';
import { InfoIcon } from 'vue-feather-icons';

import {
  NETWORK_SIZE_SHOW_WARNING,
  NETWORK_SIZE_CANCEL
} from '@/helpers/mixins';

export default {
  name: 'Results',
  props: ['pane'],
  components: {
    InfoIcon,
    Setting,
    NodeMetrics,
    NetworkGraph,
    NetworkGraphGeneral,
    NetworkGraphSpeaker,
    TimeSeries,
    Splitpanes,
    Pane
  },
  data() {
    return {
      mobile: false,
      maxHeight: '100%',
      fullscreen: {
        networkGraph1: 0,
        networkGraph2: 0,
        nodeMetrics: 0,
        timeSeries: 0
      }
    };
  },
  computed: {
    showFirstGraph() {
      return this.$store.getters['main/selectedNetwork']('pane1') !== null;
    },
    showSecondGraph() {
      return this.$store.getters['main/selectedNetwork']('pane2') !== null;
    },
    type() {
      const network1 = this.$store.getters['main/selectedNetwork']('pane1');
      const network2 = this.$store.getters['main/selectedNetwork']('pane2');

      if (network1 !== null) {
        return network1.type;
      } else if (network2 !== null) {
        return network2.type;
      }
      return null;
    },
    timeoutWarning1: {
      get() {
        return (
          this.$store.getters['main/timeoutWarning']('pane1') ===
            NETWORK_SIZE_SHOW_WARNING ||
          this.$store.getters['main/timeoutWarning']('pane1') ===
            NETWORK_SIZE_CANCEL
        );
      },
      set(val) {
        this.$store.commit('main/setTimeoutWarning', {
          pane: 'pane1',
          value: val
        });
      }
    },
    timeoutWarning2: {
      get() {
        return (
          this.$store.getters['main/timeoutWarning']('pane2') ===
            NETWORK_SIZE_SHOW_WARNING ||
          this.$store.getters['main/timeoutWarning']('pane2') ===
            NETWORK_SIZE_CANCEL
        );
      },
      set(val) {
        this.$store.commit('main/setTimeoutWarning', {
          pane: 'pane2',
          value: val
        });
      }
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowResizeHandler();
      this.resized();
    });
    this.windowResizeHandler();
  },
  methods: {
    resized(paneId) {
      for (let ref in this.$refs) {
        this.$refs[ref]?.resizeHandler();
      }
      if (paneId !== null) {
        this.resize(paneId);
      }
    },
    windowResizeHandler() {
      if (window.innerWidth < 768) {
        this.mobile = true;
        this.maxHeight = '200%';
      } else {
        this.mobile = false;
        this.maxHeight = '100%';
      }
    },
    toggleFullscreen(idx, event, sautoId) {
      let current = this.fullscreen[idx];
      for (let idx in this.fullscreen) this.fullscreen[idx] = 0;
      this.fullscreen[idx] = 1 - current;
      if (current)
        window.setTimeout(() => {
          for (let ref in this.$refs) this.$refs[ref]?.resizeHandler();
        }, 250);
      else window.setTimeout(() => this.$refs[idx]?.resizeHandler(), 250);

      //sauto
      this.mouseClick(event, sautoId);
    }
  }
};
</script>

<style>
.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
}

.splitpanes__splitter:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.4s;
  background-color: rgba(255, 0, 0, 0.3);
  opacity: 0;
  z-index: 1;
}

.splitpanes--vertical > .splitpanes__splitter:before {
  left: -20px;
  right: -20px;
  height: 100%;
}

.splitpanes--horizontal > .splitpanes__splitter:before {
  top: -20px;
  bottom: -20px;
  width: 100%;
}

.splitpanes--horizontal > .splitpanes__splitter {
  width: 100%;
  margin: auto;
}

/* .splitpanes--vertical > .splitpanes__splitter {
  top: 1%;
} */
.splitpanes__pane {
  position: relative;
}
.info-button {
  z-index: 3;
  position: absolute;
  right: 0;
}
.ego-info-button {
  margin-right: 3.3em;
  margin-top:0.4em;
  margin-bottom: 0.5em;
}
.ts-info-button {
  margin-right: 1.9em;
  margin-top:0.3em;
  margin-bottom: 0.5em;
}
.fullscreen-button {
  position: absolute;
  z-index: 2;
  right: 0;
  background: transparent !important;
  border: #d3d9df;
}
.modal.guide .modal-dialog {
  max-width: 60%!important;
}
</style>
