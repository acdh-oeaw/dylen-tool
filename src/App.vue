<template>
  <div
      ref="app"
      id="app"
      style="margin-top:0; height:100%;"
      @mousemove="mouseMove"
      @click="mouseClick"
      @wheel="scroll">
    <b-container
        fluid
        class="h-100">
      <b-row
          align-v="center"
          class="p-0"
          style="border-bottom:solid darkgray thin">
        <b-col xl="1">
          <h2 style="text-align:center;"><b>DYLEN</b></h2>
        </b-col>
        <b-col
            class=" pr-0 mr-0"
            style="border-left:solid darkgray thin;">
            <b-row
                xl="12"
                class="p-0 mb-0 mt-0"
                align-h="end"
                align-v="center">
              <b-col
                  align="center"
                  class="pl-6">
                <b>Query 1:</b>
              </b-col>
              <b-col
                  xl="11"
                  style="border-right: solid;border-right-color:darkgray; border-width: thin" class="pb-2 pt-2 mt-0 mb-0">
                <search-form
                    :with-labels="false"
                    :pane="'pane'+1"
                    :is-sidebar="false">
                </search-form>
              </b-col>
            </b-row>
            <b-row
                style="border-top: solid thin darkgray"
                xl="12"
                class="p-0 mb-0 mt-0"
                align-h="end"
                align-v="center">
              <b-col
                  xl="1"
                  align="center"
                  class="pl-6">
                <b>Query 2: </b>
              </b-col>
              <b-col
                  xl="11"
                  class="pb-2 pt-2 mt-0 mb-0">
                <search-form
                    :with-labels="false"
                    :pane="'pane'+2"
                    :is-sidebar="false">
                </search-form>
              </b-col>
            </b-row>
        </b-col>
      </b-row>
      <b-row xl="12" style="background-color: beige" class="fill-height h-100">
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
import SearchForm from '@/components/SearchForm'

export default {
  name: 'App',
  components: {
    Results, Modal, SearchForm
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

.fill-height {
  min-height: 100%;
  height: auto !important; /* cross-browser */
  height: 100%; /* cross-browser */
}

.overflow-hidden {
  overflow: hidden;
}
</style>
