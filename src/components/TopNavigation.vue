<template>
  <b-row
      align-h="center"
      xl="12"
      style="height:100%; border-bottom: solid thick; border-bottom-color: grey"
      align-v="stretch">
      <b-col
          class="h-100"
          xl="auto"
          align-self="center">
        <h2><b>DYLEN</b></h2>
      </b-col>
      <b-col
          class="pb-1"
          xl="5"
          align-self="stretch">
        <b-row class="h-100" align-h="center" align-v="stretch">
          <b-col class="h-100" align-self="stretch" v-if="!firstForm">
            <b-button
                class="button"
                size="sm"
                variant="secondary"
                @click="queryButtonClicked(1)">
              <b>Query 1</b>
            </b-button>
          </b-col>
          <b-col v-else-if="firstForm">
            <b-row>
              <b-col>
                <search-form
                    :with-labels="false"
                    :pane="'pane'+1"
                    :is-sidebar="false">
                </search-form>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
      <b-col
          class="ml-1 pb-1"
          align-self="stretch">
        <b-row class="h-100">
          <b-col
              class="h-100"
              v-if="!secondForm"
              align-self="stretch" >
            <b-button
                v-if="firstForm && !secondForm"
                class="button"
                size="sm"
                variant="secondary"
                @click="queryButtonClicked(2)">
              <b>Query 2</b>
            </b-button>
          </b-col>
          <b-col v-else>
            <search-form
                :with-labels="false"
                :pane="'pane'+2"
                :is-sidebar="false">
            </search-form>
          </b-col>
          <b-col xl="1"></b-col>
        </b-row>
      </b-col>
  </b-row>
</template>

<script>

import SearchForm from "@/components/SearchForm";

export default {
  name: 'TopNavigation',
  props: ['firstForm', 'secondForm'],
  components: {
    SearchForm
  },
  methods: {
    queryButtonClicked(button) {
      if (button === 1) {
        this.firstForm = true;
      } else if (button === 2) {
        this.secondForm = true;
      } else {
        console.log('none')
      }
    }
  }
}
</script>

<style>
.button {
  width:100%;
  height:100%;
  opacity: 1.0;
  display:block;
}
</style>
