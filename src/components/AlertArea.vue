<template>
  <b-toast
    title="Target word not found"
    v-model="targetWordNotFound"
    variant="warning"
    solid
    :no-auto-hide="true"
    toaster="b-toaster-top-center"
  >
    The target word could not be found. The previous ego network is kept instead.
  </b-toast>
</template>
    
<script>
export default {
  computed: {
    targetWordNotFound: {
      get() {
        return this.$store.getters['main/targetWordNotFound'];
      },
      set(val) {
        this.$store.commit('main/setTargetWordNotFound', val);
      }
    }
  }
};
</script>
    