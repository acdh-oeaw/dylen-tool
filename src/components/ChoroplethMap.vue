<template>
  <div class="vis-component" ref="chart">
    <div class="placeholder">
      <b>Here comes the choropleth map</b>.
      <p>Selected states by clicking on the bar chart: {{ selectedStates }}</p>
    </div>
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
    </svg>
  </div>
</template>

<script>

import mapStatesUSA from '@/assets/us-states-geo.json';

export default {
  name: 'ChoroplethMap',
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
    // Use the following map geoJSON object ("mapStatesUSA") for your projection
    console.log(mapStatesUSA);
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
    selectedStates: {
      get() {
        return this.$store.getters.selectedStates;
      }
    },
  },
  watch: {
  },
}
</script>

<style>
</style>
