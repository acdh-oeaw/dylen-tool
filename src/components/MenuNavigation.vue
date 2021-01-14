<template>
  <div @mouseover="mouseOver" class="row">
    <div class="col">
      <b-list-group>
        Query Type:
        <b-list-group-item variant="success">Ego Networks</b-list-group-item>
        <b-list-group-item variant="light">General Networks</b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MenuNavigation',
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    mouseOver(event){
      event.preventDefault();
      const x = event.clientX;
      const y = event.clientY;
      this.$store.dispatch('sauto/send',{x,y});
    }
  },
  computed: {
  },
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
