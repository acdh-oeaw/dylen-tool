<template>
  <b-form @submit='onSubmit'>
    <b-row>
      <b-col
        xl='5'
        @mouseover='mouseOver'
        data-sauto-id='selectCorpus'
      >
        <b-form-group
          id='select-corpus-group-viz'
          label='Corpus: '
          label-size='sm'
          label-cols-xl='4'
        >
          <b-form-select
            size='sm'
            v-model='selectedCorpus'
            data-sauto-id='selectCorpus'
          >
            <b-form-select-option
              v-for="option in availableCorpora"
              v-bind:key="option"
              v-bind:value="option"
              :data-sauto-id="'corpusOption-' + option"
            >
              {{ option }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col
        xl='5'
        @mouseover='mouseOver'
        data-sauto-id='selectSubCorpus'
      >
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
            data-sauto-id='selectSubCorpus'
          >
            <b-form-select-option
              v-for="option in availableSources"
              v-bind:key="option"
              v-bind:value="option"
              :data-sauto-id="'subCorpusOption-' + option"
            >
              {{ option }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        xl='5'
        @mouseover='mouseOver'
        data-sauto-id='selectTargetword'
      >
        <b-form-group
          id='select-targetword-group-biz'
          label='Targetword:'
          label-size='sm'
          label-cols-xl='4'
          label-for='select-targetword'
          label-align-lg='left'
        >
          <b-form-input
            size="sm"
            v-model="searchTerm"
            data-sauto-id="selectTargetWord"
            :list="`datalist-${pane}`"
            @change="setTargetWord"
            autocomplete="off"
          ></b-form-input>
          <datalist :id='`datalist-${pane}`'>
            <option
              v-for="option in availableTargetwords"
              v-bind:key="option.text + option.pos"
              v-bind:value="option.text"
              :data-sauto-id="'targetWord-' + option.text"
            >
              {{ option.pos.split('_').join(' ') }}
            </option>
          </datalist>
          <!-- {{availableTargetwords}} -->
        </b-form-group>
      </b-col>

      <b-col
        xl='5'
        @mouseover='mouseOver'
        data-sauto-id='selectYear'
      >
        <b-form-group
          id='select-year-group-viz'
          label='Year:'
          label-for='select-year'
          label-size='sm'
          label-cols-xl='4'
          label-align-lg='left'
        >
          <div
            @mouseover='mouseOver'
            data-sauto-id='selectYear'
          >
            <b-form-select
              size='sm'
              v-model='selectedYear'
              data-sauto-id='selectYear'
            >
              <b-form-select-option
                v-for="option in selectedTargetword.networks"
                v-bind:key="option.year"
                v-bind:value="option"
                :data-sauto-id="'year-' + option.year"
              >
                {{ option.year }}
              </b-form-select-option>
            </b-form-select>
          </div>
        </b-form-group>
      </b-col>
      <b-col xl='auto'>
        <b-button
          size="sm"
          type="submit"
          variant="secondary"
          data-sauto-id="queryButton"
          :disabled="!searchTerm || searchTerm.length == 0"
          @mouseover="mouseOver"
        >
          Query
        </b-button>
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
    },
    setTargetWord() {
      let target = this.availableTargetwords.find(
        (t) => t.text == this.searchTerm
      );
      this.selectedTargetword = target;
    }
  },
  computed: {
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
      }
    },
    availableSources: {
      get() {
        return this.$store.getters['main/availableSourcesByCorpus'](
          this.selectedCorpus
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
        if (val) this.$store.dispatch('main/loadTargetWords', this.queryPane);
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
        this.$store.commit('main/changeSearchTerm', {
          targetword: val,
          pane: this.queryPane
        });
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
</style>
