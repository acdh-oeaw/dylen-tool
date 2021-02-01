<template>
  <div ref="app" id="app" @mousemove="mouseMove" @click="mouseClick" @wheel="scroll">
    <div class="container-fluid">
      <div class="row">
        <div @mouseover="mouseOver" data-sauto-id="sidebar" class="col-md-2">
          <Sidebar/>
        </div>
        <div @mouseover="mouseOver" data-sauto-id="results" class="col-md-10">
          <Results/>
        </div>
      </div>
      <Modal/>
    </div>
  </div>
</template>

<script>

import Sidebar from '@/components/Sidebar';
import Results from '@/components/Results';
import Modal from '@/components/SautoConfirmationModal';

export default {
  name: 'App',
  components: {
    Sidebar, Results, Modal
  },
  created: function () {
    this.$store.dispatch('main/loadAvailableQueryParams');
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
.overflow-hidden {
  overflow: hidden;
}
</style>
