<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h2 style="text-align:center;">DYLEN DEV</h2>
      </div>
    </div>
    <MenuNavigation/>
  </div>
</template>

<script>

import MenuNavigation from '@/components/MenuNavigation';

export default {
  name: 'Sidebar',
  components: {
    MenuNavigation
  },
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
  },
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
