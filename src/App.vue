<template>
  <div
      ref="app"
      id="app"
      style="margin-top:0; height:100%; max-height: 720px"
      @mousemove="mouseMove"
      @click="mouseClick"
      @wheel="scroll">
    <b-container fluid>
      <b-row
          align-v="center"
          class="p-0"
          style="border-bottom:solid; border-bottom-color:darkgray; border-width:thin">
        <b-col xl="1">
          <h3 style="text-align:center;">DYLEN</h3>
        </b-col>
        <b-col
            class="pl-0 ml-0 pr-0 mr-0"
            style="border-left:solid;
            border-left-color:darkgray;
            border-width: thin;">
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
                  xl="5"
                  style="border-right: solid;border-right-color:darkgray; border-width: thin" class="pb-2 pt-2 mt-0 mb-0">
                <search-form
                    :with-labels="false"
                    :pane="'pane'+1"
                    :is-sidebar="false">
                </search-form>
              </b-col>
              <b-col
                  align="center"
                  class="pl-6">
                <b>Query 2: </b>
              </b-col>
              <b-col
                  xl="5"
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
      <b-row xl="12">
        <b-col xl="12">
          <div
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
