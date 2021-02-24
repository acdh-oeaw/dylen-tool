<template>
  <div class="row mt-2">
    <div class="col">
      New Query:
      <b-form @submit="onSubmit">
        <b-form-group id="select-corpus-group" label="Corpus:" label-for="select-corpus">
          <div @mouseover="mouseOver" data-sauto-id="selectCorpus">
            <b-form-select v-model="selectedCorpus" data-sauto-id="selectCorpus">
              <b-form-select-option v-for="option in availableQueryParams" v-bind:key="option.name"
                                    v-bind:value="option" :data-sauto-id="'corpusOption-'+option.name">
                {{ option.name }}
              </b-form-select-option>
            </b-form-select>
          </div>
        </b-form-group>

        <b-form-group id="select-subcorpus-group" label="Subcorpus:" label-for="select-subcorpus">
          <div @mouseover="mouseOver" data-sauto-id="selectSubCorpus">
            <b-form-select v-model="selectedSubcorpus" data-sauto-id="selectSubCorpus">
              <b-form-select-option v-for="option in selectedCorpus.sources" v-bind:key="option.name"
                                    v-bind:value="option" :data-sauto-id="'subCorpusOption-'+option.name">
                {{ option.name }}
              </b-form-select-option>
            </b-form-select>
          </div>
        </b-form-group>

        <b-form-group id="select-targetword-group" label="Target Word:" label-for="select-targetword">
          <div @mouseover="mouseOver" data-sauto-id="selectTargetWord">
            <b-form-select v-model="selectedTargetword" data-sauto-id="selectTargetWord">
              <b-form-select-option v-for="option in selectedSubcorpus.targetWords" v-bind:key="option.text"
                                    v-bind:value="option" :data-sauto-id="'targetWord-'+option.text">
                {{ option.text }}
              </b-form-select-option>
            </b-form-select>
          </div>
        </b-form-group>

        <b-form-group id="select-year-group" label="Year:" label-for="select-year">
          <div @mouseover="mouseOver" data-sauto-id="selectYear">
            <b-form-select v-model="selectedYear" data-sauto-id="selectYear">
              <b-form-select-option v-for="option in selectedTargetword.networks" v-bind:key="option.year"
                                    v-bind:value="option" :data-sauto-id="'year-'+option.year">
                {{ option.year }}
              </b-form-select-option>
            </b-form-select>
          </div>
        </b-form-group>

        <b-button type="submit" variant="primary" v-bind:disabled="isButtonDisabled" data-sauto-id="queryButton"
                  @mouseover="mouseOver">
          Query
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SearchForm',
  props: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadEgoNetwork', 'pane1');
    },
  },
  computed: {
    availableQueryParams: {
      get() {
        return this.$store.getters["main/availableQueryParams"];
      }
    },
    selectedCorpus: {
      get() {
        return this.$store.getters["main/selectedCorpus"]('pane1')
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedCorpus', val);
      }
    },
    selectedSubcorpus: {
      get() {
        return this.$store.getters["main/selectedSubcorpus"]('pane1');
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedSubcorpus', val);
      }
    },
    selectedTargetword: {
      get() {
        return this.$store.getters["main/selectedTargetword"]('pane1');
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedTargetword', val);
      }
    },
    selectedYear: {
      get() {
        return this.$store.getters["main/selectedYear"]('pane1');
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedYear', val);
      }
    },
    isButtonDisabled() {
      if (this.$store.getters["main/egoNetworks"].length < 2) return false;
      return true;
    },
  },
  watch: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
