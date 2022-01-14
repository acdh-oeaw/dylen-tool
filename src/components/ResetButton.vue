<template>
  <b-button
      block
      class='reset-button query-bar-button'
      size='sm'
      variant='danger'
      type='reset'
      :data-sauto-id='"resetQueryButton-"+this.pane'
      @click='resetClicked'
      v-b-tooltip.hover
      title="Reset query"
  >
    Reset
  </b-button>
</template>

<script>
export default {
  name: "ResetButton",
  props: ["pane"],
  methods: {
    resetClicked() {
      this.$emit('resetClicked')
    }
  }

}
</script>

<style scoped>

</style>