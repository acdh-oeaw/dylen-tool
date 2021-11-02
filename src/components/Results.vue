<template>
  <b-row class='h-100'>
    <splitpanes
      :style="{height: maxHeight, width: '100%'}"
      :horizontal="mobile"
      @resized="resized"
      @pane-maximize="resized"
    >
      <pane>
        <splitpanes
          horizontal
          @resized="resized"
          @pane-maximize="resized"
        >
          <pane>
            <NetworkGraph
              v-if='networkCount>=1'
              ref='networkGraph1'
              pane='pane1'
            />
          </pane>
          <pane v-if='networkCount===2'>
            <NetworkGraph
              ref='networkGraph2'
              pane='pane2'
            />
          </pane>
        </splitpanes>
      </pane>
      <pane>
        <splitpanes
          horizontal
          @resized="resized"
          @pane-maximize="resized"
        >
          <pane>
            <NodeMetrics ref='nodeMetrics'>
            </NodeMetrics>
          </pane>
          <pane>
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
      maxHeight: '100%'
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
  width: 90%;
  margin: auto;
}
.splitpanes--vertical > .splitpanes__splitter {
  top: 1%;
}
</style>
