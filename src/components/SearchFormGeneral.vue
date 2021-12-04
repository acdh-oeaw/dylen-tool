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
        <div>
          <b-form-select
            size='sm'
            v-model='selectedMetric'
            :data-sauto-id="'selectMetric-'+this.pane"
          >
            <b-form-select-option
              v-for='option in availableMetrics'
              v-bind:key='option.id'
              v-bind:value='option'
              :data-sauto-id="'metricOption-' + option"
            >
              {{ option }}
            </b-form-select-option>
          </b-form-select>
          <custom-slider min="10" max="50" step="2" raising v-model="slider" />
          {{ slider }}
        </div>
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
import CustomSlider from "vue-custom-range-slider";

export default {
  components: {
    CustomSlider
  },
  name: 'SearchFormGeneral',
  props: ['isSidebar', 'pane', 'withLabels'],
  data() {
    return {
      corpusEdit: false,
      slider: "12",
      subcorpusEdit: false,
      targetwordEdit: false,
      yearEdit: false
    };
  },
  mounted() {},
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadGeneralNetwork', {pane: this.queryPane, slider: this.$data.slider});
      this.$store.dispatch('main/loadTimeSeriesData', this.queryPane);
    },
    findSearchTermInAvailableTargetwords() {
      return this.availableTargetwords.find((t) => t.text === this.searchTerm);
    },
    handleSearchTermSelect() {
      const target = this.findSearchTermInAvailableTargetwords();
      this.$store.dispatch('main/loadTargetwordBySearchTerm', {pane:this.queryPane, searchTerm: target} )

      const rect = this.$refs.selectTargetWord.$el.getBoundingClientRect();
      const event = {
        clientX: rect.x,
        clientY: rect.y
      };
      this.mouseClick(event, 'selectTargetWord-option-' + this.searchTerm);
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
    hasSuggestions() {
      if (this.availableTargetwords.length === 0 && this.searchTerm) {
        return false;
      }
      return true;
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
    availableMetrics: {
      get() {
        return ['Jaccard', 'Centrality', '...'];
      }
    },
    selectedMetric: {
      get() {
        return this.$store.getters['main/selectedMetric'](this.queryPane);
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
        return this.$store.getters['main/selectedParty'](this.queryPane);
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
