<template>
  <svg ref="svg" class="parallel-coordinates" :viewBox="viewBox">
    <g>
      <g class="x_axis"></g>
      <g class="y_axis"></g>
      <g class="labels"></g>
    </g>
  </svg>
</template>
<script>
export default {
  name: "ParallelCoordinates",
  props: ["netNodes", "options"],
  computed: {
    viewBox() {
      return `0 0 ${this.options.size.w} ${this.options.size.h}`;
    },
  }
}
</script>

<style scoped>

</style>