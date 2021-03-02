<template>
  <div ref="app" id="app" style="margin-top:0;height:100%;max-height: 720px" @mousemove="mouseMove" @click="mouseClick" @wheel="scroll">
    <b-container fluid>
        <b-row md="12" align-v="center" class="p-0" style="border-bottom:solid;border-bottom-color: darkgray; border-width: thin">
          <b-col md="2" >
            <h2 style="text-align:center;">DYLEN</h2>
          </b-col>
          <b-col md="10">
            <b-container fluid>
              <b-row md="12" class="p-0 mb-0 mt-0">
                <b-col md="6" style="border-right: solid; border-right-color:darkgray; border-width: thin" class="pb-2 pt-2 mt-0 mb-0">
                  <search-form
                      :with-labels="false"
                      :pane="'pane'+1"
                      :is-sidebar="false">
                  </search-form>
                </b-col>
                <b-col md="6" class="pb-2 pt-2 mt-0 mb-0">
                  <search-form
                      :with-labels="false"
                      :pane="'pane'+2"
                      :is-sidebar="false">
                  </search-form>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
        <b-row md="12">
          <b-col md="12">
            <div @mouseover="mouseOver" data-sauto-id="results">
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
html, body {
  height: 100%;
}
.fill-height {
  min-height: 100%;
  height:auto !important; /* cross-browser */
  height: 100%; /* cross-browser */
}
.overflow-hidden {
  overflow: hidden;
}
</style>
