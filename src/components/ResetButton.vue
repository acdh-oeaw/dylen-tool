<template>
  <b-button
      block
      class='reset-button query-bar-button'
      size='sm'
      variant='danger'
      type='button'
      :data-sauto-id='"resetQueryButton-"+type+"-"+this.pane'
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
  },
  computed: {
    type() {
      return this.$store.getters['main/topNav'].networkType;
    },
  }

}
</script>

<style scoped>

</style>
