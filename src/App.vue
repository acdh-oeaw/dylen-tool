<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-2">
          <Sidebar/>
        </div>
        <div class="col-md-10">
          <Results/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Sidebar from '@/components/Sidebar';
import Results from '@/components/Results';

export default {
  name: 'App',
  components: {
    Sidebar, Results
  },
  mounted() {
    this.$store.dispatch('main/loadAvailableQueryParams');
  },
}
</script>

<style>
#app {
  /*
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  */
  color: #2c3e50;
  margin-top: 20px;
}
</style>
