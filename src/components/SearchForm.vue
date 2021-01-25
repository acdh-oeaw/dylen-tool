<template>
  <div class="row mt-2">
    <div class="col">
      New Query:
      <b-form @submit="onSubmit">

        <b-form-group id="select-corpus-group" label="Corpus:" label-for="select-corpus" data-sauto-id="selectCorpus" @mouseover="mouseOver">
          <b-select v-model="selectedCorpus" data-sauto-id="selectCorpus">
            <option v-for="option in availableQueryParams" v-bind:key="option.name" v-bind:value="option" data-sauto-id="selectCorpusOption">
              {{option.name}}
            </option>
          </b-select>
<!--          <v-select-->
<!--            v-model="selectedCorpus"-->
<!--            :options="availableQueryParams"-->
<!--            :clearable="false"-->
<!--            label="name"-->
<!--          />-->
        </b-form-group>

        <b-form-group id="select-subcorpus-group" label="Subcorpus:" label-for="select-subcorpus" data-sauto-id="selectSubCorpus" @mouseover="mouseOver">
          <b-select v-model="selectedSubcorpus" data-sauto-id="selectSubCorpus">
            <option v-for="option in selectedCorpus.sources" v-bind:key="option.name" v-bind:value="option" data-sauto-id="selectSubCorpusOption">
              {{option.name}}
            </option>
          </b-select>
<!--          <v-select-->
<!--            v-model="selectedSubcorpus"-->
<!--            :options="selectedCorpus.sources"-->
<!--            :clearable="false"-->
<!--            label="name"-->
<!--          />-->
        </b-form-group>

        <b-form-group id="select-targetword-group" label="Target Word:" label-for="select-targetword" data-sauto-id="selectTargetWord" @mouseover="mouseOver">
          <b-select v-model="selectedTargetword" data-sauto-id="selectTargetWord">
            <option v-for="option in selectedSubcorpus.targetWords" v-bind:key="option.text" v-bind:value="option" data-sauto-id="selectTargetWordOption">
              {{option.text}}
            </option>
          </b-select>
<!--          <v-select-->
<!--            v-model="selectedTargetword"-->
<!--            :options="selectedSubcorpus.targetWords"-->
<!--            :clearable="false"-->
<!--            label="text"-->
<!--          />-->
        </b-form-group>
        <b-form-group id="select-year-group" label="Year:" label-for="select-year">
          <v-select
              v-model="selectedYear"
              :options="selectedTargetword.networks"
              :clearable="false"
              label="year"
          />
        </b-form-group>

        <b-button type="submit" variant="primary" v-bind:disabled="isButtonDisabled" data-sauto-id="queryButton" @mouseover="mouseOver">
          Query
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SearchForm',
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('main/loadEgoNetwork');
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
        return this.$store.getters["main/selectedCorpus"];
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedCorpus', val);
      }
    },
    selectedSubcorpus: {
      get() {
        return this.$store.getters["main/selectedSubcorpus"];
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedSubcorpus', val);
      }
    },
    selectedTargetword: {
      get() {
        return this.$store.getters["main/selectedTargetword"];
      },
      set(val) {
        if (val) this.$store.commit('main/changeSelectedTargetword', val);
      }
    },
    selectedYear: {
      get() {
        return this.$store.getters["main/selectedYear"];
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
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
