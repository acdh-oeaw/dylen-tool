<template>
  <div ref="app" id="app" @mousemove="mouseMove" @click="mouseClick">
    <div class="container-fluid">
      <div class="row">
        <div @mouseover="mouseOver" data-sauto-id="sidebar" class="col-md-2">
          <Sidebar/>
        </div>
        <div @mouseover="mouseOver" data-sauto-id="results" class="col-md-10">
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
  created: function () {
    this.$store.dispatch('main/loadAvailableQueryParams');
    this.$store.dispatch('sauto/connect');

  },
  methods: {
  }
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
