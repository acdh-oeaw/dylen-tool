<template>
  <b-row xl="12">
      <b-col xl="auto" align-self="center">
        <h2><b>DYLEN</b></h2>
      </b-col>
      <b-col
          xl="11"
          align-self="center">
        <b-row xl="12">
          <b-col v-if="!firstForm">
            <b-button
                pill
                size="sm"
                variant="primary"
                @click="queryButtonClicked(1)">
              +
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
              <b-col xl="1">
                <b-button
                    v-if="firstForm && !secondForm"
                    size="sm"
                    pill
                    variant="primary"
                    @click="queryButtonClicked(2)">
                  +
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row xl="12">
          <b-col v-if="secondForm">
            <b-row>
              <b-col>
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
