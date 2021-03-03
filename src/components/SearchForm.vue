<template>
  <b-container fluid>
    <b-form @submit="onSubmit">
      <b-row>
        <b-col
            v-b-tooltip.hover title="Corpus"
            xl="2"
            @mouseover="mouseOver"
            data-sauto-id="selectCorpus">
          <b-form-group
              id="select-corpus-group-viz"
              label="Corpus: "
              label-cols-xl="5">
            <b-form-select
                size="sm"
                v-model="selectedCorpus"
                data-sauto-id="selectCorpus">
              <b-form-select-option
                  v-for="option in availableQueryParams"
                  v-bind:key="option.name"
                  v-bind:value="option"
                  :data-sauto-id="'corpusOption-'+option.name">
                {{ option.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col
            v-b-tooltip.hover title="Subcorpus"
            @mouseover="mouseOver"
            data-sauto-id="selectSubCorpus">
          <b-form-group
              id="select-subcorpus-group-viz"
              label="Subcorpus:"
              label-cols-xl="4"
              label-for="select-subcorpus">
            <b-form-select
                size="sm"
                v-model="selectedSubcorpus"
                data-sauto-id="selectSubCorpus">
              <b-form-select-option
                  v-for="option in selectedCorpus.sources"
                  v-bind:key="option.name"
                  v-bind:value="option"
                  :data-sauto-id="'subCorpusOption-'+option.name">
                {{ option.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col
            v-b-tooltip.hover title="Targetword"
            @mouseover="mouseOver"
            data-sauto-id="selectTargetword">
          <b-form-group
              id="select-targetword-group-biz"
              label="Targetword:"
              label-cols-xl="4"
              label-for="select-targetword"
              label-align-lg="left">
            <b-form-select
                size="sm"
                v-model="selectedTargetword"
                data-sauto-id="selectTargetWord">
              <b-form-select-option
                  v-for="option in selectedSubcorpus.targetWords"
                  v-bind:key="option.text"
                  v-bind:value="option"
                  :data-sauto-id="'targetWord-'+option.text">
                {{ option.text }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col
            v-b-tooltip.hover title="Year"
            xl="2"
            @mouseover="mouseOver"
            data-sauto-id="selectYear">
          <b-form-group
              id="select-year-group-viz"
              label="Year:"
              label-for="select-year"
              label-size="sm"
              label-cols-xl="4"
              label-align-lg="left">
            <div
                @mouseover="mouseOver"
                data-sauto-id="selectYear">
              <b-form-select
                  size="sm"
                  v-model="selectedYear"
                  data-sauto-id="selectYear">
                <b-form-select-option
                    v-for="option in selectedTargetword.networks"
                    v-bind:key="option.year"
                    v-bind:value="option"
                    :data-sauto-id="'year-'+option.year">
                  {{ option.year }}
                </b-form-select-option>
              </b-form-select>
            </div>
          </b-form-group>
        </b-col>
        <b-col xl="1">
          <b-button
              size="sm"
              type="submit"
              variant="primary"
              data-sauto-id="queryButton"
              @mouseover="mouseOver">
            Query
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>

export default {
  name: 'SearchForm',
  props: ['isSidebar', 'pane', 'withLabels'],
  data() {
    return {
      corpusEdit:false,
      subcorpusEdit:false,
      targetwordEdit:false,
      yearEdit:false,
    }
  },
  mounted() {
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadEgoNetwork', this.queryPane);
    },
  },
  computed: {
    queryPane() {
      if (this.pane)
        return this.pane;

      let count = 0;
      const network1 = this.$store.getters["main/getPane"]('pane1').selectedNetwork
      const network2 = this.$store.getters["main/getPane"]('pane2').selectedNetwork

      if (network1) {
        count++;
      }
      if (network2) {
        count++;
      }

      if (count > 0) return 'pane2';
      return "pane1";
    },
    availableQueryParams: {
      get() {
        return this.$store.getters["main/availableQueryParams"];
      }
    },
    selectedCorpus: {
      get() {
        return this.$store.getters["main/selectedCorpus"](this.queryPane)
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedCorpus', {corpus: val, pane: this.queryPane});
      }
    },
    selectedSubcorpus: {
      get() {
        return this.$store.getters["main/selectedSubcorpus"](this.queryPane);
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedSubcorpus', {subcorpus: val, pane: this.queryPane});
      }
    },
    selectedTargetword: {
      get() {
        return this.$store.getters["main/selectedTargetword"](this.queryPane);
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedTargetword', {targetword: val, pane: this.queryPane});
      }
    },
    selectedYear: {
      get() {
        return this.$store.getters["main/selectedYear"](this.queryPane);
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedYear', {year: val, pane: this.queryPane});
      }
    },
  },
  watch: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-group {
  margin-bottom: 0rem;
}
</style>
