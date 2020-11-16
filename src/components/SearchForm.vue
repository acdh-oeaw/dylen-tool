<template>
  <div class="row mt-2">
    <div class="col">
      New Query:
      <b-form @submit="onSubmit">

        <b-form-group id="select-corpus-group" label="Corpus:" label-for="select-corpus">
          <v-select
            v-model="selectedCorpus"
            :options="availableQueryParams"
            :clearable="false"
            label="name"
          />
        </b-form-group>

        <b-form-group id="select-subcorpus-group" label="Subcorpus:" label-for="select-subcorpus">
          <v-select
            v-model="selectedSubcorpus"
            :options="selectedCorpus.sources"
            :clearable="false"
            label="name"
          />
        </b-form-group>

        <b-form-group id="select-targetword-group" label="Target Word:" label-for="select-targetword">
          <v-select
            v-model="selectedTargetword"
            :options="selectedSubcorpus.targetWords"
            :clearable="false"
            label="text"
          />
        </b-form-group>

        <b-button type="submit" variant="primary" v-bind:disabled="isButtonDisabled">
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
      this.$store.dispatch('loadEgoNetwork');
    },
  },
  computed: {
    availableQueryParams: {
      get() {
        return this.$store.getters.availableQueryParams;
      }
    },
    selectedCorpus: {
      get() {
        return this.$store.getters.selectedCorpus;
      },
      set(val) {
        if (val) this.$store.commit('changeSelectedCorpus', val);
      }
    },
    selectedSubcorpus: {
      get() {
        return this.$store.getters.selectedSubcorpus;
      },
      set(val) {
        if (val) this.$store.commit('changeSelectedSubcorpus', val);
      }
    },
    selectedTargetword: {
      get() {
        return this.$store.getters.selectedTargetword;
      },
      set(val) {
        if (val) this.$store.commit('changeSelectedTargetword', val);
      }
    },
    isButtonDisabled() {
      if (this.$store.getters.egoNetworks.length < 2) return false;
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
