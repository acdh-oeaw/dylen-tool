<template>
  <b-form @submit='onSubmit'>
    <b-row
      text-center
      xl='12'>
      <b-col
          xl='12'
          class='mlr-0'>
          <b-row
              xl='12'
              class='mt-2 mlr-0 plr-0'
          >
            <b-col>
              <b-form-group
                id='select-party-group-viz'
                label='Party: '
                label-size='sm'
                label-cols-xl='3'
            >
              <b-form-select
                  size='sm'
                  v-model='selectedParty'
                  :data-sauto-id="'selectParty-'+this.pane"
              >
                <b-form-select-option
                    v-for='option in availableParties'
                    v-bind:key='option.id'
                    v-bind:value='option'
                    :data-sauto-id="'partyOption-' + option"
                >
                  {{ option }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
      </b-row>
      <b-row xl='12'>
        <b-col xl='12'>
          <node-filter
              @sliderValueChanged='handleSliderValue'
              :available-metrics='availableMetrics'
              :pane='queryPane'></node-filter>
        </b-col>
      </b-row>
      <b-row xl='12' class='mt-2'>
        <b-col xl='6'>
          <visualize-button :queryButtonActive='queryButtonActive' :query-pane='queryPane'></visualize-button>
        </b-col>
        <b-col xl='6'>
          <reset-button @resetClicked='initialize' :pane='queryPane'></reset-button>
        </b-col>
      </b-row>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import VisualizeButton from "@/components/VisualizeButton";
import ResetButton from "@/components/ResetButton";
import NodeFilter from "@/components/NodeFilter";

export default {
  components: {
    NodeFilter,
    VisualizeButton, ResetButton
  },
  name: 'SearchFormGeneral',
  props: ['isSidebar', 'pane', 'withLabels'],
  data() {
    return {
      valueSlid: [0, 20],
      corpusEdit: false,
      isNetworkLoading: false,
      subcorpusEdit: false,
      targetwordEdit: false,
      yearEdit: false
    };
  },
  mounted() {
    let defaultParty = "ÖVP";

    let selectedParty = this.$store.getters['main/selectedGeneralNetworkParty'](this.pane);

    if (selectedParty.party === "") {
      this.selectedParty = defaultParty;
    } else {
      this.selectedParty = selectedParty.party;
    }
  },
  methods: {
    handleSliderValue(values) {
      this.$data.valueSlid=values
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadGeneralNetwork', {
        pane: this.queryPane,
        sliderMin: this.$data.valueSlid[0]/100,
        sliderMax: this.$data.valueSlid[1]/100,
      }).then(() => {
        this.isNetworkLoading = false;
        this.$emit('visualizeClicked')
      }).finally(() => {
        this.isNetworkLoading = false;
      });
      this.$store.dispatch('main/loadGeneralTimeSeriesData', this.queryPane);
    },
    findSearchTermInAvailableTargetwords() {
      return this.availableTargetwords.find((t) => t.text === this.searchTerm);
    },
    setShowInfo() {
      this.$emit('showInfoButton', true);
      this.$store.commit('main/setShowInfo', {showInfo: false});
    },
    initialize() {
      this.$store.commit('main/changeSelectedParty', {
        party: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeSelectedMetric', {
        metric: null,
        pane: this.queryPane
      });
      this.$store.commit('main/resetSelectedNetwork', {
        network: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeSecondFormVisibility', {
        pane: this.queryPane
      });
      this.$store.commit('main/resetTimeSeries', {
        pane: this.queryPane
      });
      console.log('initialised');
    }
  },
  computed: {
    queryButtonActive() {
      return this.selectedParty != null;
    },
    queryPane() {
      if (this.pane) return this.pane;

      let count = 0;
      const network1 =
          this.$store.getters['main/getPane']('pane1').selectedNetwork;
      const network2 =
          this.$store.getters['main/getPane']('pane2').selectedNetwork;

      if (network1 || network2) {
        count++;
      }

      if (count > 0) return 'pane2';
      return 'pane1';
    },
    availableParties: {
      get() {
        return this.$store.getters['main/availableParties'];
      }
    },
    availableMetrics: {
      get() {
        return this.$store.getters['main/availableMetrics'];
      }
    },
    selectedParty: {
      get() {
        return this.$store.getters['main/selectedGeneralNetworkParty'](this.queryPane);
      },
      set(val) {
        if (val) {
          this.$store.commit('main/changeSelectedParty', {
            party: val,
            pane: this.queryPane
          });
          console.log('Set to: ' + val);
        }
      }
    },
    selectedYear: {
      get() {
        return this.$store.getters['main/selectedYear'](this.queryPane);
      },
      set(val) {
        if (val)
          this.$store.commit('main/changeSelectedYear', {
            year: val,
            pane: this.queryPane
          });
      }
    }
  },
  watch: {}
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style src="@vueform/slider/themes/default.css"></style>

<style scoped>
.form-group {
  margin-bottom: 0rem;
}

.custom-select-sm {
  height: calc(1.5em + 0.5rem + 2px);
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  font-size: 0.7rem;
}

.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.visualize-button {
  margin-right: 0.5em;
}

.align-end {
  text-align: end;
}

.reset-button {
  border: none;
  color: red;
  background-color: white;
  border-color: white;
}
</style>
