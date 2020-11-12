<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h2>DYLEN DEV</h2>
      </div>
    </div>
    <MenuNavigation/>
    <SidebarQueryArea/>
  </div>
</template>

<script>

import MenuNavigation from '@/components/MenuNavigation';
import SidebarQueryArea from '@/components/SidebarQueryArea';

export default {
  name: 'Sidebar',
  components: {
    MenuNavigation, SidebarQueryArea
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
