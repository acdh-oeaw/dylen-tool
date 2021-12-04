<template>
  <b-form @submit='onSubmit'>
    <b-row>
      <b-col xl='8'>
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
              v-bind:key='option.id'
              v-bind:value='option'
              :data-sauto-id="'partyOption-' + option"
            >
              {{ option }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col xl='8'>
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
      <b-col xl='4'>
        <b-row align-h='end'>
          <b-col
            xl='12'
            class='align-end'
          >
            <b-button
              class='visualize-button'
              size='sm'
              type='submit'
              variant='secondary'
              :data-sauto-id='"queryButton-"+this.pane'
              :disabled='!queryButtonActive'
              @click='setShowInfo'
            >
              Visualize
            </b-button>
            <b-button
              class='reset-button'
              size='sm'
              variant='secondary'
              :data-sauto-id='"queryButton-"+this.pane'
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
                <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z" />
                <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z" />
              </svg>
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'SearchFormGeneralSpeaker',
  props: ['isSidebar', 'pane', 'withLabels'],
  data() {
    return {
      corpusEdit: false,
      subcorpusEdit: false,
      targetwordEdit: false,
      yearEdit: false
    };
  },
  mounted() {},
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadGeneralSpeakerNetwork', this.queryPane);
      this.$store.dispatch('main/loadTimeSeriesData', this.queryPane);
    },
    setShowInfo() {
      this.$emit('showInfoButton', true);
      this.$store.commit('main/setShowInfo', { showInfo: false });
    },
    initialize() {
      this.$store.commit('main/changeSelectedParty', {
        party: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeAvailableSpeakers', {
        speakers: [],
        pane: this.queryPane
      });
      this.$store.commit('main/changeSelectedSpeaker', {
        speaker: null,
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
        //return this.$store.getters['main/availableParties'];
        return ['SPÖ', 'KPÖ', 'FPÖ', 'GRÜNE', 'ÖVP'];
      }
    },
    availableSpeakers: {
      get() {
        return this.$store.getters['main/availableSpeakers'](this.queryPane);
      }
    },
    selectedParty: {
      get() {
        return this.$store.getters['main/selectedParty'](this.queryPane);
      },
      set(val) {
        if (val) {
          this.$store.commit('main/changeSelectedParty', {
            party: val,
            pane: this.queryPane
          });
          this.$store.dispatch('main/loadAvailableSpeakers', this.queryPane, val);
          console.log('Set to: ' + val);
        }
      }
    },
    selectedSpeaker: {
      get() {
        return this.$store.getters['main/selectedSpeaker'](this.queryPane);
      },
      set(val) {
        if (val) {
          this.$store.commit('main/changeSelectedSpeaker', {
            speaker: val,
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
