<template>
  <div class="row mt-2">
    <div v-if='isSidebar==true' class="col">
      New Query:
      <b-form @submit="onSubmit">
        <b-form-group id="select-corpus-group" label="Corpus:"  label-for="select-corpus">
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

    <div v-else-if="isSidebar==false" class="col" >
      <b-form @submit="onSubmit">
        <b-row align-h="center">
          <b-col cols="6">
            <b-form-group id="select-corpus-group-viz"
                          label="Corpus:"
                          label-for="select-corpus"
                          label-size="sm"
                          label-cols-lg="3"
                          content-cols-lg="9"
                          label-align-lg="right">

              <span @mouseover="mouseOver"
                data-sauto-id="selectCorpus">
                <b-form-select size="sm"
                           v-model="selectedCorpus"
                           data-sauto-id="selectCorpus">
                  <b-form-select-option v-for="option in availableQueryParams"
                                    v-bind:key="option.name"
                                    v-bind:value="option"
                                    :data-sauto-id="'corpusOption-'+option.name">
                  {{ option.name }}
                  </b-form-select-option>
                </b-form-select>
              </span>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group id="select-subcorpus-group-viz"
                          label="Subcorpus:"
                          label-for="select-subcorpus"
                          label-size="sm"
                          label-cols-lg="3"
                          content-cols-lg="9"
                          label-align-lg="right">
              <span @mouseover="mouseOver"
                data-sauto-id="selectSubCorpus">
                <b-form-select v-model="selectedSubcorpus"
                           data-sauto-id="selectSubCorpus">
                  <b-form-select-option v-for="option in selectedCorpus.sources"
                                    v-bind:key="option.name"
                                    v-bind:value="option"
                                    :data-sauto-id="'subCorpusOption-'+option.name">
                    {{ option.name }}
                  </b-form-select-option>
                </b-form-select>
              </span>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col cols="6">
            <b-form-group id="select-targetword-group-biz"
                          label="Target Word:"
                          label-for="select-targetword"
                          label-size="sm"
                          label-cols-lg="3"
                          content-cols-lg="9"
                          label-align-lg="right">
              <span @mouseover="mouseOver"
                data-sauto-id="selectTargetWord">
                <b-form-select
                  v-model="selectedTargetword"
                  data-sauto-id="selectTargetWord">
                  <b-form-select-option v-for="option in selectedSubcorpus.targetWords"
                                    v-bind:key="option.text"
                                    v-bind:value="option"
                                    :data-sauto-id="'targetWord-'+option.text">
                    {{ option.text }}
                  </b-form-select-option>
                </b-form-select>
              </span>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group id="select-year-group-viz"
                          label="Year:"
                          label-for="select-year"
                          label-size="sm"
                          label-cols-lg="3"
                          content-cols-lg="9"
                          label-align-lg="right">
              <div @mouseover="mouseOver"
                   data-sauto-id="selectYear">
                <b-form-select v-model="selectedYear"
                               data-sauto-id="selectYear">
                  <b-form-select-option v-for="option in selectedTargetword.networks"
                                        v-bind:key="option.year"
                                        v-bind:value="option"
                                        :data-sauto-id="'year-'+option.year">
                    {{ option.year }}
                  </b-form-select-option>
                </b-form-select>
              </div>
            </b-form-group>
          </b-col>

        </b-row>
        <b-row align-h="end">
          <b-col align="end">
            <b-button type="submit" variant="primary" v-bind:disabled="isButtonDisabled" data-sauto-id="queryButton"
                      @mouseover="mouseOver">   Query     </b-button>

          </b-col>
        </b-row>


      </b-form>
    </div>

  </div>
</template>

<script>

export default {
  name: 'SearchForm',
  props: ['isSidebar','pane'],
  data() {
    return {}
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
      if(this.pane)
        return this.pane;
      if (this.$store.getters["main/egoNetworks"].length > 0 ) return 'pane2';
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
        if (val) this.$store.commit('main/changeSelectedCorpus', {corpus:val, pane:this.queryPane});
      }
    },
    selectedSubcorpus: {
      get() {
        return this.$store.getters["main/selectedSubcorpus"](this.queryPane);
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedSubcorpus', {subcorpus:val, pane:this.queryPane});
      }
    },
    selectedTargetword: {
      get() {
        return this.$store.getters["main/selectedTargetword"](this.queryPane);
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedTargetword', {targetword:val, pane:this.queryPane});
      }
    },
    selectedYear: {
      get() {
        return this.$store.getters["main/selectedYear"](this.queryPane);
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedYear', {year:val, pane:this.queryPane});
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
