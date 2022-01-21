<template>
  <b-button
      size='sm'
      block
      type='submit'
      variant='info'
      :data-sauto-id='"queryButton-"+this.queryPane'
      :disabled='!queryButtonActive'
      @click='setShowInfo'
  >
    Visualize <b-spinner
      v-if='busy'
      label="Spinning"
      small
  ></b-spinner>
  </b-button>
</template>

<script>
export default {
  name: "VisualizeButton",
  props: ['queryButtonActive', 'queryPane'],
  computed: {
    busy: {
      get() {
        return this.$store.getters['main/busyState'](this.queryPane);
      },
      set(val) {
        console.log('setting busy state: ' + val)
        this.$store.commit('main/setBusyState', {
          busy: val,
          pane: this.queryPane
        });
      }
    }
  },
  methods: {
    setShowInfo() {
      this.$store.commit('main/setShowInfoButton', { showInfoButton: true });
      this.$store.commit('main/setShowInfo', { showInfo: false });
    }
  }
}
</script>

<style scoped>

</style>