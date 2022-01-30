<template>
  <b-button
      block
      class='reset-button query-bar-button'
      size='sm'
      variant='danger'
      type='button'
      :data-sauto-id='"resetQueryButton-"+this.type+"-"+this.pane'
      @click='resetClicked'
      v-b-tooltip.hover
      title="Reset query"
  >
    Reset
  </b-button>
</template>

<script>
import { networkTypeMixin } from '@/helpers/mixins';

export default {
  mixins: [networkTypeMixin],
  name: "ResetButton",
  props: ["pane"],
  methods: {
    resetClicked() {
      this.$emit('resetClicked')
    }
  },

}
</script>

<style scoped>

</style>
