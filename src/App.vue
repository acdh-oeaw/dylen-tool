<template>
  <div
      id="app"
      ref="app"
      style="margin-top:0;"
      style="margin-top:0; height:100%;"
      @mousemove="mouseMove"
      @click="mouseClick"
      @wheel="scroll">
    <b-container
        class="pt-1 pb-5"
        fluid>
      <top-navigation
          class="mb-20"
          style="min-height:72px;"
          :first-form="false"
          :second-form="false">
      </top-navigation>
      <b-row xl="12">
        <b-col xl="12">
          <div
              class="h-100"
              @mouseover="mouseOver"
              data-sauto-id="results">
            <Results/>
          </div>
        </b-col>
      </b-row>
      <Modal/>
    </b-container>
  </div>
</template>

<script>

import Results from '@/components/Results';
import Modal from '@/components/SautoConfirmationModal';
import TopNavigation from "@/components/TopNavigation";

export default {
  name: 'App',
  components: {
    TopNavigation,
    Results, Modal
  },
  created: function () {
    this.$store.dispatch('main/loadAvailableQueryParams');
  },
  methods: {}
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

html, body {
  height: 100%;
}

</style>
