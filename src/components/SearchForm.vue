<template>
  <div class="row">
    <div class="col">
      New Query:
      <b-form @submit="onSubmit">

        <b-form-group id="select-corpus-group" label="Corpus:" label-for="select-corpus">
          <b-form-select
            id="select-corpus"
            v-model="selectedCorpusID"
            :options="availableQueryParams"
            @change="onSelectedCorpusChange"
            value-field="id"
            text-field="name"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group id="select-subcorpus-group" label="Subcorpus:" label-for="select-subcorpus">
          <b-form-select
            id="select-subcorpus"
            v-model="selectedSubcorpusID"
            :options="selectedCorpus.sources"
            @change="onSelectedSubcorpusChange"
            value-field="id"
            text-field="name"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group id="select-targetword-group" label="Target Word:" label-for="select-targetword">
          <b-form-select
            id="select-targetword"
            v-model="selectedTargetwordID"
            :options="selectedSubcorpus.networks"
            @change="onSelectedTargetwordChange"
            value-field="id"
            text-field="text"
            required
          ></b-form-select>
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
    onSelectedCorpusChange(corpusID) {
      if (corpusID) this.$store.commit('changeSelectedCorpus', corpusID);
    },
    onSelectedSubcorpusChange(subcorpusID) {
      if (subcorpusID) this.$store.commit('changeSelectedSubcorpus', subcorpusID);
    },
    onSelectedTargetwordChange(networkID) {
      if (networkID) this.$store.commit('changeSelectedTargetword', networkID);
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
      }
    },
    selectedSubcorpus: {
      get() {
        return this.$store.getters.selectedSubcorpus;
      }
    },
    selectedTargetword: {
      get() {
        return this.$store.getters.selectedTargetword;
      }
    },
    selectedCorpusID: {
      get() {
        return this.$store.getters.selectedCorpusID;
      },
      set(val) {
        if (val) this.$store.commit('changeSelectedCorpusID', val);
      }
    },
    selectedSubcorpusID: {
      get() {
        return this.$store.getters.selectedSubcorpusID;
      },
      set(val) {
        if (val) this.$store.commit('changeSelectedSubcorpusID', val);
      }
    },
    selectedTargetwordID: {
      get() {
        return this.$store.getters.selectedTargetwordID;
      },
      set(val) {
        if (val) this.$store.commit('changeSelectedTargetwordID', val);
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
