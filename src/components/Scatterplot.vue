<template>
  <div class="vis-component" ref="chart">
    <div class="placeholder">
      <b>Here comes the scatterplot</b>.
      <p>Burglary rates for the selected year: {{ burglaryRates }}</p>
    </div>
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Scatterplot',
  props: {
  },
  data() {
    return {
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20, right: 20, bottom: 20, left: 20,
      },
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    burglaryRates: {
      get() {
        return this.$store.getters.burglaryRates;
      }
    },
    medianIncome: {
      get() {
        return this.$store.getters.medianIncome;
      }
    },
  },
  watch: {
  },
}
</script>

<style>
</style>
