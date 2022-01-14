<template>
  <b-form @submit='onSubmit'>
    <b-row
        text-center
        v-if='isVertical'
        xl='12'>
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
          <b-col xl='12'>
            <b-form-group
                id='select-targetword-group-biz'
                label='Targetword:'
                label-size='sm'
                label-cols-xl='12'
                label-for='select-targetword'
                label-align-lg='left'
            >
              <b-form-input
                  ref='selectTargetWord'
                  size='sm'
                  v-model='searchTerm'
                  :data-sauto-id="'selectTargetword-'+this.pane"
                  :list='`datalist-${pane}`'
                  :style="!hasSuggestions ? { 'color': 'lightcoral' } : null"
                  @change='handleSearchTermSelect'
                  @keypress='this.keyPress'
                  autocomplete='off'
              ></b-form-input>
              <datalist v-if='showSuggestions' :id='`datalist-${pane}`'>
                <option
                    v-for='option in availableTargetwords'
                    v-bind:key='option.text + option.pos'
                    v-bind:value='option.text'
                >
                  {{ option.text + ' (' + option.pos.replace("_", " ") + ')' }}
                </option>
              </datalist>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="text-center" xl='12'>
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

export default {
  name: 'SearchForm',
  components: {ResetButton, VisualizeButton},
  props: ['isVertical', 'isSidebar', 'pane', 'withLabels'],
  data() {
    return {
      corpusEdit: false,
      subcorpusEdit: false,
      targetwordEdit: false,
      yearEdit: false,
      searchTermSelected: false
    };
  },
  mounted() {},
  methods: {
    checkInvalidChars(val) {
      let invalidChars = []
      for (let c of val) {
        if (c.match(/[1-9;:\s!@#$%^&*)(+=.,'"_]/)) {
          console.log('contains invalid character.')
          invalidChars.push(c)
        }
      }
      return invalidChars
    },
    validateSearchTerm(val) {
      this.$store.commit('main/resetError', {
        pane: this.queryPane
      });
      let invalidChars = this.checkInvalidChars(val)
      if(invalidChars.length > 0) {
        this.$store.commit('main/addError', {
          error: "contains invalid character(s): '" + invalidChars.join(' ') + "'",
          pane: this.queryPane
        });
      } else {
        if(this.errors.length === 0) {
          this.$store.commit('main/changeSearchTerm', {
            searchTerm: val,
            pane: this.queryPane
          });
        }
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadEgoNetwork', this.queryPane);
      this.$store.dispatch('main/loadTimeSeriesData', this.queryPane);
      let settingsComponent = this.$store.getters['main/activeSettings']
      if (!settingsComponent) {
        this.$store.commit('main/changeActiveSettings', {active:true, component: 'egoNetwork'})
      }
    },
    findSearchTermInAvailableTargetwords() {
      return this.availableTargetwords.find((t) => t.text === this.searchTerm);
    },
    handleSearchTermSelect() {
      console.log('handle searchterm select: ' + target)
      const target = this.findSearchTermInAvailableTargetwords();
      this.$store.dispatch('main/loadTargetwordBySearchTerm', {
        pane: this.queryPane,
        searchTerm: target
      });

      const rect = this.$refs.selectTargetWord.$el.getBoundingClientRect();
      const event = {
        clientX: rect.x,
        clientY: rect.y
      };
      this.mouseClick(event, 'selectTargetWord-option');
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
    showSuggestions() {
      if (this.searchTerm && this.selectedTargetword.text && (this.searchTerm.toLowerCase() === this.selectedTargetword.text.toLowerCase())) {
        return false
      }
      return true
    },
    hasSuggestions() {
      return !(this.availableTargetwords.length === 0 && this.searchTerm);

    },
    errors() {
      console.log('CHECKING ERRORS' + this.$store.getters['main/getPane']('pane1').errors)
      return this.$store.getters['main/getPane']('pane1').errors;
    },
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
        this.validateSearchTerm(val)

      }
    }
  },
  watch: {
  }

};
</script>
<style scoped>
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
