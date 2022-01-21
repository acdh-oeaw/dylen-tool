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
          <pane :size="fullscreen['networkGraph1'] ? 100 : fullscreen['networkGraph2'] ? 0 : 50">
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
import {
  NETWORK_SIZE_SHOW_WARNING,
  NETWORK_SIZE_CANCEL
} from '@/helpers/mixins';

export default {
  name: 'Results',
  props: ['pane'],
  components: {
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
    toggleSideBar(component) {
      this.$store.commit('main/changeActiveSettings', { component: component });
    },
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

.fullscreen-button {
  position: absolute;
  z-index: 2;
  right: 0;
  background: transparent !important;
  border: #d3d9df;
}
</style>
