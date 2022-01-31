<template>
  <b-form @submit='onSubmit'>
    <b-row
      text-center
      xl='12'
    >
      <b-col xl='12'>
        <b-row xl='12'>
          <b-col>
            <b-form-group
              id='select-corpus-group-viz'
              label='Corpus: '
              label-size='sm'
              label-cols-xl='12'
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
                  data-sauto-id="corpusOption"
                >
                  {{ option.name }} ({{option.id}})
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row xl='12'>
          <b-col>
            <b-form-group
              id='select-subcorpus-group-viz'
              label='Subcorpus:'
              label-size='sm'
              label-cols-xl='12'
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
                  data-sauto-id="subCorpusOption"
                >
                  {{ option.name}}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row xl='12'>
          <b-col xl='12' class='query'>
            <b-form-group
              id='select-targetword-group-biz'
              label='Targetword:'
              label-size='sm'
              label-cols-xl='12'
              label-for='select-targetword'
              label-align-lg='left'
            >
              <b-form-input
                v-model='searchTerm'
                ref='selectTargetWord'
                size='sm'
                :data-sauto-id="'selectTargetword-'+this.pane"
                :list='`datalist-${pane}`'
                :style="!hasSuggestions ? { 'color': 'lightcoral' } : null"
                @keypress='e => this.keyPress(e,"selectTargetWord")'
                autocomplete='off'
              ></b-form-input>
              <div v-for="error in errors" :key="error">
                <b-alert show variant='danger'>{{error}}</b-alert>
              </div>

              <datalist :id='`datalist-${pane}`'>
                <option
                  v-for='option in availableTargetwords.filter(() => showSuggestions)'
                  v-bind:key='option.text + option.pos'
                  v-bind:value='option.text + " (" + option.pos + ")"'
                >
                </option>
              </datalist>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row
          class="text-center"
          xl='12'
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
const logger = require('../helpers/logger');
export default {
  name: 'SearchForm',
  components: { ResetButton, VisualizeButton },
  props: ['pane'],
  data() {
    return {
      currentPos: ''
    }
  },
  mounted() {
    this.$root.$on('networkTypeChanged', () => {
      this.initialize();
    });
  },
  methods: {
    checkInvalidChars(val) {
      let invalidChars = [];
      for (let c of val) {
        if (c.match(/[1-9;:\s!@#$%^&*)(+=.,'"_]/)) {
          logger.log('contains invalid character.');
          invalidChars.push(c);
        }
      }
      return invalidChars;
    },
    resetError() {
      this.$store.commit('main/resetError', {
        pane: this.queryPane
      });
    },
    validateSearchTerm(val) {
      let invalidChars = this.checkInvalidChars(val);
      if (invalidChars.length > 0) {
        this.$store.commit('main/addError', {pane: this.queryPane,error:"contains invalid character(s): '" + invalidChars.join(' ') + "'"})
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadEgoNetwork', this.queryPane).then(() => {
        //TODO: make events as constants
        this.$emit('visualizeClicked');
      });
      this.$store.dispatch('main/loadTimeSeriesData', this.queryPane);

      let settingsComponent = this.$store.getters['main/activeSettings'];
      if (!settingsComponent) {
        this.$store.commit('main/changeActiveSettings', {
          active: true,
          component: 'egoNetwork'
        });
      }
    },
    findSearchTermInAvailableTargetwords(searchTerm) {
      return this.availableTargetwords.find((t) => t.text === searchTerm && t.pos === this.currentPos);
    },
    handleDatalistSelection() {
      let matchedSuggestion = this.findSearchTermInAvailableTargetwords(this.searchTerm);
      this.$store.dispatch('main/loadTargetwordBySearchTerm', {
        pane: this.queryPane,
        searchTerm: matchedSuggestion
      }).then(() => {
        let matchedIndex = this.availableTargetwords.indexOf(matchedSuggestion)
        this.availableTargetwords.splice(matchedIndex, 1)
        this.$store.dispatch('main/setAutocompleteSuggestions', {
          suggestions: [matchedSuggestion],
          pane: this.queryPane
        })
      });
      this.sautoTargetWordSelectedEvent();
    },
    handleInput() {
      if (this.errors.size === 0) {
        this.$store.dispatch('main/loadAutocompleteSuggestions', { pane: this.queryPane, searchTerm: this.searchTerm}).then(response => {
          this.$store.dispatch('main/setAutocompleteSuggestions', {
            suggestions: response.data.data.getAutocompleteSuggestions,
            pane: this.queryPane
          })
        })
      }
    },
    initialize() {
      this.$store.commit('main/setTimeoutWarning', {
        pane: this.queryPane,
        value: false
      });
      this.$store.commit('main/changeSelectedCorpus', {
        corpus: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeSelectedSubcorpus', {
        subcorpus: null,
        pane: this.queryPane
      });
      this.$store.dispatch('main/changeSearchTerm', {
        searchTerm: null,
        pane: this.queryPane
      });
      this.$store.commit('main/changeSelectedTargetword', {
        targetword: null,
        pane: this.queryPane
      });
      this.$store.dispatch('main/resetSelectedNetwork', {
        pane: this.queryPane
      });
      this.$store.commit('main/resetTimeSeries', {
        pane: this.queryPane
      });
      logger.log('initialised');
    },
    splitTermAndPos: function (val) {
      const allPoS = ['noun', 'verb', 'adjective', 'proper_noun']
      let termAndPos = val.replace('(','').replace(')','').split(' ')
      if (termAndPos.length > 2 || (termAndPos.length === 2 && !allPoS.includes(termAndPos[1]))) {
        this.$store.commit('main/addError', {pane: this.queryPane,error:"contains whitespace"})
        return null
      }
      this.currentPos = termAndPos.length === 2 ? termAndPos[1] : ''

      return {term: termAndPos[0], pos: termAndPos[1]}
    },
    sautoTargetWordSelectedEvent: function () {
      const rect = this.$refs.selectTargetWord.$el.getBoundingClientRect();
      const event = {
        clientX: rect.x,
        clientY: rect.y
      };
      this.mouseClick(event, 'selectTargetWord-option');
    }
  },
  computed: {
    showSuggestions() {
      if (
        this.searchTerm &&
        this.selectedTargetword.text &&
        this.searchTerm.toLowerCase() ===
          this.selectedTargetword.text.toLowerCase()
      ) {
        return false;
      }
      return true;
    },
    hasSuggestions() {
      return !(this.availableTargetwords.length === 0 && this.searchTerm);
    },
    errors() {
      logger.log('CHECKING ERRORS' + this.$store.getters['main/getPane']('pane1').errors);
      return new Set(this.$store.getters['main/getPane'](this.queryPane).errors);
    },
    queryButtonActive() {
      if (
        !this.searchTerm ||
        this.searchTerm.length === 0 ||
        !this.findSearchTermInAvailableTargetwords(this.searchTerm)
      ) {
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

      return count > 0 ? 'pane2' : 'pane1'
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
          this.resetError()
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
          this.resetError()
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
        let currentSearchTerm = this.$store.getters['main/searchTerm'](this.queryPane);
        console.debug('CURRENT SEARCHTERM: ' + currentSearchTerm)
        return currentSearchTerm
      },
      set(val) {
        this.resetError()
        let termAndPos = this.splitTermAndPos(val)
        if (termAndPos !== null) {
          this.validateSearchTerm(termAndPos.term)
          if (termAndPos.pos && termAndPos.term === this.searchTerm) {
            if (this.errors.size === 0) {
              this.$store.dispatch('main/changeSearchTerm', {
                searchTerm: '',
                pane: this.queryPane
              }).then(() => {
                if (this.errors.size === 0) {
                  this.$store.dispatch('main/changeSearchTerm', {
                    searchTerm: termAndPos.term,
                    pane: this.queryPane
                  }).then(() => {
                    this.handleDatalistSelection()
                  })
                }
              })
            }
          } else {
            if (this.errors.size === 0) {
              this.$store.dispatch('main/changeSearchTerm', {
                searchTerm: termAndPos.term,
                pane: this.queryPane
              }).then(() => {
                this.handleInput()
              })
            }
          }
        }

      }
    }
  },
  watch: {}
};
</script>
<style scoped>
.align-end {
  text-align: end;
}
.query .alert {
  font-size: 0.8rem;
  position: relative;
  padding: 0.1rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}
</style>
