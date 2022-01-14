<template>
  <b-form @submit='onSubmit'>
    <b-row
        text-center
        v-if='isVertical'
        xl='12'
    >
      <b-col xl='12' class='mlr-0'>
        <b-row
            class='mt-2 mlr-0 plr-0'
            xl='12'
        >
          <b-col>
            <b-form-group
                id='select-party-group-viz'
                label='Party: '
                label-size='sm'
                label-cols-xl='2'
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
          <b-card class='mt-0'>
              <b-row xl='12'>
                <b-col xl=12 class='mt-0 text-center' style='font-size:0.9em'>
                  <h7>
                    <info-icon size="1.2x" class="custom-class" style='color:red' v-b-modal.threshold></info-icon>
                    Node filter
                  </h7>
                </b-col>
              </b-row>
              <b-row xl='12'>
                <b-col xl=12 class='mb-2' style='font-size:0.9em'>
                  Metric:
                  <b-form-select
                      size='sm'
                      v-model='selectedMetric'
                      :data-sauto-id="'selectGeneralMetric-'+this.pane"
                  >
                    <b-form-select-option
                        v-for='option in availableMetrics'
                        v-bind:key='option.id'
                        v-bind:value='option'
                        :data-sauto-id="'metricGeneralOption-' + option"
                    >
                      {{ option }}
                    </b-form-select-option>
                  </b-form-select>
                </b-col>
              </b-row>
              <b-row xl='12' class='mt-2'>
                <b-col xl=12 class='mtb-2' style='font-size:0.9em'>
                  Threshold:
                  <b-modal id='threshold' title='Node filter with threshold slider'>
                    <alert-triangle-icon size="1.2x" class="custom-class" style='color:red'></alert-triangle-icon>
                    General Network graphs consist of large number of nodes and edges. <br>
                    Visualizing such large graphs can be computation intensive and depending on the computational resources,
                    the visualization might take longer time or might freeze the browser. <br>
                    <hr>
                    The threshold slider lets you select which nodes you want to visualize. <br>
                    For example, if you want to view top 10% nodes with the highest degress centrality,
                    you should select 'degrees centrality' from the drop down selector and move the slider and select
                    90 - 100%
                  </b-modal>
                </b-col>
              </b-row>
              <b-row xl='12'>
                <b-col xl='12' class='mt-2'>
                  <Slider
                      :format="sliderFormat"
                      showTooltip="always"
                      tooltipPosition="bottom"
                      v-model="valueSlid"/>
                </b-col>

              </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row align-h='end' xl='12'>
        <b-col
            xl='12'
            class='align-end'
        >
          <div class="mt-2">
            <b-button
                class='visualize-button'
                size='sm'
                type='submit'
                block=true
                variant='secondary'
                :data-sauto-id='"queryButtonGeneral-"+this.pane'
                :disabled='!queryButtonActive'
                @click='setShowInfo'
            >
              <div v-if="isNetworkLoading">
                <b-spinner small></b-spinner>
              </div>
              <div v-if="!isNetworkLoading">
                Visualize
              </div>
            </b-button>
            <b-button
                class='reset-button'
                size='sm'
                variant='secondary'
                :data-sauto-id='"queryButtonGeneral-"+this.pane'
                @click='initialize'
                v-b-tooltip.hover
                title="Reset query"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-bootstrap-reboot"
                  viewBox="0 0 16 16"
              >
                <path
                    d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z"/>
                <path
                    d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z"/>
              </svg>
            </b-button>
          </div>
        </b-col>
      </b-row>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import Slider from '@vueform/slider/dist/slider.vue2.js';
import {InfoIcon, AlertTriangleIcon} from 'vue-feather-icons'

export default {
  components: {
    Slider, InfoIcon, AlertTriangleIcon
  },
  name: 'SearchFormGeneral',
  props: ['isSidebar', 'isVertical', 'pane', 'withLabels'],
  data() {
    return {
      corpusEdit: false,
      valueSlid: [0, 20],
      isNetworkLoading: false,
      sliderFormat: function (value) {
        return `${Math.round(value)}%`
      },
      subcorpusEdit: false,
      targetwordEdit: false,
      yearEdit: false
    };
  },
  mounted() {
    let defaultParty = "ÖVP";
    let defaultMetric = "Pagerank";

    let selectedParty = this.$store.getters['main/selectedGeneralNetworkParty']('pane1');
    let selectedMetric = this.$store.getters['main/selectedGeneralNetworkMetric']('pane1');

    if (selectedParty.party === "") {
      this.selectedParty = defaultParty;
    } else {
      this.selectedParty = selectedParty.party;
    }

    if (selectedMetric.metric === "") {
      this.selectedMetric = defaultMetric;
    } else {
      this.selectedMetric = selectedMetric.metric;
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.isNetworkLoading = true;
      this.$store.dispatch('main/loadGeneralNetwork', {
        pane: this.queryPane,
        sliderMin: this.$data.valueSlid[0] / 100,
        sliderMax: this.$data.valueSlid[1] / 100,
      }).then(() => {
        this.isNetworkLoading = false;
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
    selectedMetric: {
      get() {
        return this.$store.getters['main/selectedGeneralNetworkMetric'](this.queryPane);
      },
      set(val) {
        if (val) {
          this.$store.commit('main/changeSelectedMetric', {
            metric: val,
            pane: this.queryPane
          });
          console.log('Set metric to: ' + val);
        }
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
