<template>
  <b-row class='h-100'>
    <splitpanes
      :style="{height: maxHeight, width: '100%'}"
      :horizontal="mobile"
      @resized="resized"
      @pane-maximize="resized"
    >
      <pane :size="(fullscreen['networkGraph1'] + fullscreen['networkGraph2']) ? 100 : (fullscreen['nodeMetrics'] + fullscreen['timeSeries']) ? 0 : 50">
        <splitpanes
          horizontal
          @resized="resized"
          @pane-maximize="resized"
        >
          <pane :size="fullscreen['networkGraph1'] ? 100 : fullscreen['networkGraph2'] ? 0 : 50">
            <button
              @click="() => toggleFullscreen('networkGraph1')"
              class="fullscreen-button"
              variant="light"
            >
              <b-icon :icon="fullscreen['networkGraph1'] ? 'fullscreen-exit' : 'arrows-fullscreen'"></b-icon>
            </button>
            <NetworkGraph
              v-if='networkCount>=1'
              ref='networkGraph1'
              pane='pane1'
            />
          </pane>
          <pane
            v-if='networkCount===2'
            :size="fullscreen['networkGraph2'] ? 100 : fullscreen['networkGraph1'] ? 0 : 50"
          >
            <button
              @click="() => toggleFullscreen('networkGraph2')"
              class="fullscreen-button"
              variant="light"
            >
              <b-icon :icon="fullscreen['networkGraph2'] ? 'fullscreen-exit' : 'arrows-fullscreen'"></b-icon>
            </button>
            <NetworkGraph
              ref='networkGraph2'
              pane='pane2'
            />
          </pane>
        </splitpanes>
      </pane>
      <pane :size="(fullscreen['nodeMetrics'] + fullscreen['timeSeries']) ? 100 : (fullscreen['networkGraph1'] + fullscreen['networkGraph2']) ? 0 : 50">
        <splitpanes
          horizontal
          @resized="resized"
          @pane-maximize="resized"
        >
          <pane :size="fullscreen['nodeMetrics'] ? 100 : fullscreen['timeSeries'] ? 0 : 50">
            <button
              @click="() => toggleFullscreen('nodeMetrics')"
              class="fullscreen-button"
              variant="light"
            >
              <b-icon :icon="fullscreen['nodeMetrics'] ? 'fullscreen-exit' : 'arrows-fullscreen'"></b-icon>
            </button>
            <NodeMetrics ref='nodeMetrics'>
            </NodeMetrics>
          </pane>
          <pane :size="fullscreen['timeSeries'] ? 100 : fullscreen['nodeMetrics'] ? 0 : 50">
            <button
              @click="() => toggleFullscreen('timeSeries')"
              class="fullscreen-button"
              variant="light"
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
  </b-row>
</template>

<script>
import NetworkGraph from '@/components/NetworkGraph';
import NodeMetrics from '@/components/NodeMetrics';
import TimeSeries from '@/components/TimeSeries';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default {
  name: 'Results',
  props: ['pane'],
  components: {
    NodeMetrics,
    NetworkGraph,
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
    networkCount() {
      let count = 0;
      const network1 =
        this.$store.getters['main/getPane']('pane1').selectedNetwork;
      const network2 =
        this.$store.getters['main/getPane']('pane2').selectedNetwork;

      if (network1) {
        count++;
      }
      if (network2) {
        count++;
      }

      return count;
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
    resized() {
      for (let ref in this.$refs) {
        this.$refs[ref]?.resizeHandler();
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
    toggleFullscreen(idx) {
      let current = this.fullscreen[idx];
      for (let idx in this.fullscreen) this.fullscreen[idx] = 0;
      this.fullscreen[idx] = 1 - current;
      window.setTimeout(() => this.$refs[idx]?.resizeHandler(), 150);
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
.fullscreen-button {
  position: absolute;
  z-index: 2;
  right: 0;
  background: transparent !important;
  border: #d3d9df;
}
</style>
