<template>
  <b-form @submit='onSubmit'>
    <b-row>
      <b-col xl='6'>
        <b-form-group
          id='select-corpus-group-viz'
          label='Corpus: '
          label-size='sm'
          label-cols-xl='4'
        >
          <b-form-select
            size='sm'
            v-model='selectedCorpus'
            :data-sauto-id="'selectCorpus-'+this.pane"
          >
            <b-form-select-option
              v-for='option in availableCorpora'
              v-bind:key='option.id'
              v-bind:value='option'
              :data-sauto-id="'corpusOption-' + option"
            >
              {{ option.name }} ({{option.id}})
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col xl='6'>
        <b-form-group
          id='select-subcorpus-group-viz'
          label='Subcorpus:'
          label-size='sm'
          label-cols-xl='4'
          label-for='select-subcorpus'
        >
          <b-form-select
            size='sm'
            v-model='selectedSubcorpus'
            :data-sauto-id="'selectSubCorpus-'+this.pane"
          >
            <b-form-select-option
              v-for='option in availableSources'
              v-bind:key='option.id'
              v-bind:value='option'
              :data-sauto-id="'subCorpusOption-' + option"
            >
              {{ option.name}}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl='6'>
        <b-form-group
          id='select-targetword-group-biz'
          label='Targetword:'
          label-size='sm'
          label-cols-xl='4'
          label-for='select-targetword'
          label-align-lg='left'
        >
          <b-form-input
            ref='selectTargetWord'
            size='sm'
            v-model='searchTerm'
            :data-sauto-id="'selectTargetword-'+this.pane"
            :list='`datalist-${pane}`'
            :style="!hasSuggestions ? { 'color': 'red' } : null"
            @change='handleSearchTermSelect'
            @keypress='this.keyPress'
            autocomplete='off'
          ></b-form-input>
          <datalist :id='`datalist-${pane}`'>
            <option
              v-for='option in availableTargetwords'
              v-bind:key='option.text + option.pos'
              v-bind:value='option.text'
            >
              {{ option.text + ' (' + option.pos + ')' }}
            </option>
          </datalist>
        </b-form-group>
      </b-col>
      <b-col xl='2'></b-col>
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
  name: 'SearchForm',
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
      this.$store.dispatch('main/loadEgoNetwork', this.queryPane);
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
      this.$store.commit('main/changeSelectedCorpus', {
        corpus: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeSelectedSubcorpus', {
        subcorpus: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeSearchTerm', {
        searchTerm: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeSelectedTargetword', {
        targetword: null,
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
      if (
        !this.searchTerm ||
        this.searchTerm.length === 0 ||
        !this.findSearchTermInAvailableTargetwords()
      ) {
        return false;
      }
      return true;
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
    availableCorpora: {
      get() {
        return this.$store.getters['main/availableCorpora'];
      }
    },
    selectedCorpus: {
      get() {
        return this.$store.getters['main/selectedCorpus'](this.queryPane);
      },
      set(val) {
        if (val)
          this.$store.commit('main/changeSelectedCorpus', {
            corpus: val,
            pane: this.queryPane
          });
        if (val && this.searchTerm && this.searchTerm.length > 0) {
          this.$store.dispatch(
            'main/loadAutocompleteSuggestionsForNewSubCorpus',
            {
              targetword: this.searchTerm,
              pane: this.queryPane
            }
          );
        }
      }
    },
    availableSources: {
      get() {
        return this.$store.getters['main/availableSourcesByCorpus'](
          this.selectedCorpus.id
        );
      }
    },
    selectedSubcorpus: {
      get() {
        return this.$store.getters['main/selectedSubcorpus'](this.queryPane);
      },
      set(val) {
        if (val)
          this.$store.commit('main/changeSelectedSubcorpus', {
            subcorpus: val,
            pane: this.queryPane
          });
        if (val && this.searchTerm && this.searchTerm.length > 0) {
          this.$store.dispatch(
            'main/loadAutocompleteSuggestionsForNewSubCorpus',
            {
              targetword: this.searchTerm,
              pane: this.queryPane
            }
          );
        }
      }
    },
    availableTargetwords: {
      get() {
        return this.$store.getters['main/autocompleteSuggestions'](
          this.queryPane
        );
      }
    },
    getTargetwordById: {
      get() {
        return this.$store.getters['main/loadTargetwordById'](this.queryPane)
      }
    },
    selectedTargetword: {
      get() {
        return this.$store.getters['main/selectedTargetword'](this.queryPane);
      },
      set(val) {
        if (val)
          this.$store.commit('main/changeSelectedTargetword', {
            targetword: val,
            pane: this.queryPane
          });
      }
    },
    searchTerm: {
      get() {
        return this.$store.getters['main/searchTerm'](this.queryPane);
      },
      set(val) {
        this.$store.commit('main/changeSearchTerm', {
          searchTerm: val,
          pane: this.queryPane
        });
      }
    },
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
