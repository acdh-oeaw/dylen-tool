<template>
  <b-row
      xl="12"
      class="top-nav"
      align-h="center"
      align-v="stretch">
    <b-col
        xl="auto"
        align-self="center">
      <h2><b>DYLEN</b></h2>
    </b-col>
    <b-col
        class="pb-1"
        xl="5"
        align-self="stretch">
      <b-row
          class="h-100"
          align-h="center"
          align-v="stretch">
        <b-col>
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
      <b-row class="h-100" align-v="center">
        <b-col
            v-if="!secondForm">
          <b-button
              v-if="firstForm && !secondForm"
              size="sm"
              variant="secondary"
              v-on:click="queryButtonClicked(2)">
            <b>+</b>
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
  components: {
    SearchForm
  },
  data() {
    return {
      firstForm: true,
      secondForm: false
    }
  },
  methods: {
    queryButtonClicked(button) {
      if (button === 1) {
        this.firstForm = true;
      } else if (button === 2) {
        this.secondForm = true;
      }
    }
  }
}
</script>

<style>

.top-nav {
  height:100%;
  border-bottom: solid thick;
  border-bottom-color: grey
}
</style>
