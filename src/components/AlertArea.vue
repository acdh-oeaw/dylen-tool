<template>
  <div>
    <b-toast
      title="Target word not found"
      v-model="targetWordNotFound"
      variant="warning"
      solid
      :no-auto-hide="true"
      toaster="b-toaster-top-center"
    >
      The target word could not be found. The previous ego network is kept instead.
    </b-toast>
    <b-toast
      title="Possible application timeout"
      v-model="timeoutWarning1"
      variant="danger"
      solid
      :no-auto-hide="true"
      toaster="b-toaster-top-center"
    >
      Loading this network may have a negative impact on your system's performance. Please try again with different filter settings to load a smaller network.

    </b-toast>
    <b-toast
      title="Possible application timeout"
      v-model="timeoutWarning2"
      variant="danger"
      solid
      :no-auto-hide="true"
      toaster="b-toaster-top-center"
    >
      Loading this network may have a negative impact on your system's performance. Please try again with different filter settings to load a smaller network.

    </b-toast>
    <b-toast
      title="No edges in this network"
      v-model="noEdges"
      variant="warning"
      solid
      :no-auto-hide="true"
      toaster="b-toaster-top-center"
    >
      Looks like this network has no edges. This may be because none of the displayed words are connected to each other. Try using different filter values to show more nodes and edges.
    </b-toast>
  </div>
</template>

<script>
import {
  NETWORK_SIZE_SHOW_WARNING,
  NETWORK_SIZE_CANCEL
} from '@/helpers/mixins';

export default {
  methods: {
    cancelNetworkLoading(pane) {
      this.$store.commit('main/setTimeoutWarning', {
        pane: pane,
        value: NETWORK_SIZE_CANCEL
      });
    }
  },
  computed: {
    targetWordNotFound: {
      get() {
        return this.$store.getters['main/targetWordNotFound'];
      },
      set(val) {
        this.$store.commit('main/setTargetWordNotFound', val);
      }
    },
    timeoutWarning1: {
      get() {
        return (
          this.$store.getters['main/timeoutWarning']('pane1') ===
          NETWORK_SIZE_SHOW_WARNING
        );
      },
      set(val) {
        this.$store.commit('main/setTimeoutWarning', {
          pane: 'pane1',
          value: !val ? NETWORK_SIZE_CANCEL : NETWORK_SIZE_SHOW_WARNING
        });
      }
    },
    timeoutWarning2: {
      get() {
        return (
          this.$store.getters['main/timeoutWarning']('pane2') ===
          NETWORK_SIZE_SHOW_WARNING
        );
      },
      set(val) {
        this.$store.commit('main/setTimeoutWarning', {
          pane: 'pane2',
          value: !val ? NETWORK_SIZE_CANCEL : NETWORK_SIZE_SHOW_WARNING
        });
      }
    },
    noEdges: {
      get() {
        return (
          this.$store.getters['main/noEdgesInNetwork']('pane1') ||
          this.$store.getters['main/noEdgesInNetwork']('pane2')
        );
      },
      set(val) {
        this.$store.commit('main/setNoEdgesInNetwork', {
          pane: 'pane1',
          value: val
        });
        this.$store.commit('main/setNoEdgesInNetwork', {
          pane: 'pane2',
          value: val
        });
      }
    }
  }
};
</script>
