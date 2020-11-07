<template>
  <div>
    <label for="range-year">Year Selection</label>
    <b-form-input id="range-year" v-model="selectedYear" type="range" min="1984" max="2014"></b-form-input>
    <div class="mt-2">Selected Year: {{ selectedYear }}</div>
  </div>
</template>

<script>
export default {
  name: 'YearSlider',
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    selectedYear: {
      get() {
        return this.$store.getters.selectedYear;
      },
      set(val) {
        this.$store.commit('changeSelectedYear', val);
      },
    },
  },
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
