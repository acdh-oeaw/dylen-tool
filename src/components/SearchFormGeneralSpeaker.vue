<template>
  <b-form @submit='onSubmit'>
    <b-row>
      <b-col xl='12'>
        <b-row xl='12' class='mt-2'>
          <b-col xl='12'>
            <b-form-group
              id='select-party-group-viz'
              label='Party: '
              label-size='sm'
              label-cols-xl='4'
            >
              <b-form-select
                size='sm'
                v-model='selectedParty'
                @change='changeSelectedPartyEvent'
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
            <b-form-group
                id='select-speaker-group-viz'
                label='Speaker: '
                label-size='sm'
                label-cols-xl='4'
            >
              <b-form-select
                  size='sm'
                  v-model='selectedSpeaker'
                  :data-sauto-id="'selectSpeaker-'+this.pane"
              >
                <b-form-select-option
                    v-for='optionSpeaker in availableSpeakers'
                    v-bind:key='optionSpeaker.id'
                    v-bind:value='optionSpeaker'
                    :data-sauto-id="'speakerOption-' + optionSpeaker"
                >
                  {{ optionSpeaker }}
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
                :general-type='GENERAL_SPEAKER'
                :pane='queryPane'></node-filter>
          </b-col>
        </b-row>
        <b-row align-h='end' xl='12' class='mt-2'>
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
import NodeFilter from "@/components/NodeFilter";
import VisualizeButton from "@/components/VisualizeButton";
import ResetButton from "@/components/ResetButton";
import {networkTypeMixin, GENERAL_SPEAKER} from "@/helpers/mixins";

export default {
  mixins: [networkTypeMixin],
  props: ['pane'],
  components: {
    NodeFilter, VisualizeButton, ResetButton
  },
  data() {
    return {
      defaultMetric: "Degree Centrality",
      defaultParty: "ÖVP",
      corpusEdit: false,
      slider: 1,
      sliderFormat: function (value) {
        return `${Math.round(value)}%`
      },
      valueSlid: [0, 20]
    };
  },
  mounted() {
    let selectedParty = this.$store.getters['main/selectedGeneralNetworkSpeakerParty'](this.queryPane);

    this.selectedParty = this.checkSelectedParty(selectedParty) ? selectedParty : this.defaultParty

    this.$store.dispatch('main/loadAvailableSpeakers', {pane:this.queryPane, party:this.selectedParty}).then(() => {
      this.selectedSpeaker = this.availableSpeakers[0];
    });
    this.$root.$on('networkTypeChanged', () => {
      this.initialize()
    })
  },
  methods: {
    checkSelectedParty(party) {
      if(party) return true
      return false
    },
    handleSliderValue(values) {
      this.$data.valueSlid=values
    },
    changeSelectedPartyEvent(evt) {
      this.$store.dispatch('main/loadAvailableSpeakers', {pane:this.queryPane, event:evt}).then(() => {
        this.selectedSpeaker = this.availableSpeakers[0];
      });
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/resetSelectedNetwork', {
        pane: this.queryPane
      })
      this.$store.dispatch('main/loadGeneralSpeakerNetwork', {
        pane: this.queryPane,
        sliderMin: this.$data.valueSlid[0]/100,
        sliderMax: this.$data.valueSlid[1]/100,
      }).then(() => {
        this.$emit('visualizeClicked')
      }).finally(() => {
      });
      this.$store.dispatch('main/loadGeneralTimeSeriesData', {pane:this.queryPane, type: GENERAL_SPEAKER, entity: this.selectedSpeaker});
    },
    initialize() {
      this.$store.dispatch('main/resetGeneralNetworkSpeaker', {
        pane: this.queryPane,
        party: this.defaultParty,
        metric: this.defaultMetric,
      }).then(() => {
        this.selectedSpeaker = this.availableSpeakers[0];
      })
      console.log('initialised');
    }
  },
  computed: {
    queryButtonActive() {
      return this.selectedSpeaker != null;
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
        const party = this.$store.getters['main/selectedGeneralNetworkSpeakerParty'](this.queryPane)
        this.$store.dispatch('main/loadAvailableSpeakers', {pane:this.queryPane, party:party});
        return party;
      },
      set(val) {
        if (val) {
          this.$store.dispatch('main/changeSelectedSpeakerParty', {
            party: val,
            pane: this.queryPane
          }).then(() => {
            this.selectedSpeaker = this.availableSpeakers[0];
          })
        }
      }
    },
    availableSpeakers: {
      get() {
        return this.$store.getters['main/availableSpeakers'](this.queryPane);
      }
    },
    selectedSpeaker: {
      get() {
        return this.$store.getters['main/selectedGeneralNetworkSpeakerSpeaker'](this.queryPane);
      },
      set(val) {
        if (val) {
          this.$store.commit('main/changeSelectedSpeaker', {
            speaker: val,
            pane: this.queryPane
          });
        }
      }
    }
  },
  watch: {}
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
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
