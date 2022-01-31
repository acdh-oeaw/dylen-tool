<template>
  <b-form @submit='onSubmit'>
    <b-row
      text-center
      xl='12'
    >
      <b-col
        xl='12'
        class='mx-0 px-0'
      >
        <b-row
          xl='12'
          class='mt-0'
        >
          <b-col>
            <b-form-group
              id='select-party-group-viz'
              label='Party: '
              label-size='sm'
              label-cols-xl='4'
            >
              <b-form-select
                size='sm'
                v-model='selectedParty'
                :data-sauto-id="'selectParty-'+this.pane"
              >
                <b-form-select-option
                  v-for='option in availableParties'
                  v-bind:key='option'
                  v-bind:value='option'
                  data-sauto-id="partyOption"
                >
                  {{ option }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row
          xl='12'
          class='mx-0 px-0'
        >
          <b-col
            xl='12'
            class='px-0 mx-0'
          >
            <node-filter
              class='mx-0 px-0'
              @sliderValueChanged='handleSliderValue'
              :general-type='GENERAL_PARTY'
              :available-metrics='availableMetrics'
              :pane='queryPane'
              :initialValueSlid="valueSlid"
            ></node-filter>
          </b-col>
        </b-row>
        <b-row
          xl='12'
          class='mt-2 px-0 mx-1'
        >
          <b-col
            xl='6'
            class='px-1'
          >
            <visualize-button
              :queryButtonActive='queryButtonActive'
              :query-pane='queryPane'
            ></visualize-button>
          </b-col>
          <b-col
            xl='6'
            class='px-1'
          >
            <reset-button
              @resetClicked='initialize'
              :pane='queryPane'
            ></reset-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import VisualizeButton from '@/components/VisualizeButton';
import ResetButton from '@/components/ResetButton';
import NodeFilter from '@/components/NodeFilter';
import { networkTypeMixin, GENERAL_PARTY } from '@/helpers/mixins';
const logger = require('../helpers/logger');
export default {
  mixins: [networkTypeMixin],
  components: {
    NodeFilter,
    VisualizeButton,
    ResetButton
  },
  name: 'SearchFormGeneral',
  props: ['pane'],
  data() {
    return {
      selectedParty: 'ÖVP',
      valueSlid: [0, 5],
      corpusEdit: false
    };
  },
  mounted() {
    this.$root.$on('networkTypeChanged', () => {
      this.initialize();
    });
  },
  methods: {
    handleSliderValue(values) {
      this.$data.valueSlid = values;
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/resetSelectedNetwork', {
        pane: this.queryPane
      });
      this.$store
        .dispatch('main/loadGeneralNetwork', {
          pane: this.queryPane,
          party: this.selectedParty,
          sliderMin: this.$data.valueSlid[0] / 100,
          sliderMax: this.$data.valueSlid[1] / 100
        })
        .then(() => {
          this.$emit('visualizeClicked');
        })
        .finally(() => {});
      this.$store.dispatch('main/loadGeneralTimeSeriesData', {
        pane: this.queryPane,
        type: GENERAL_PARTY,
        entity: this.selectedParty
      });
    },
    initialize() {
      this.$store.commit('main/setTimeoutWarning', {
        pane: this.queryPane,
        value: false
      });
      this.selectedParty = 'ÖVP';

      this.$store.dispatch('main/resetGeneralNetwork', {
        pane: this.queryPane,
        party: this.selectedParty
      });
      logger.log('initialised');
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
</style>
