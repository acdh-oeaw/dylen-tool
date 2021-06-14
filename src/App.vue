<template>
  <div
    id="app"
    ref="app"
    style="margin-top: 0; height: 95%"
    @mousemove="mouseMove"
    @click="mouseClick"
    @wheel="scroll"
  >
    <b-container
      class="pt-1 pb-5 h-100"
      fluid
    >
      <b-row>
        <b-col>
          <top-navigation
            class="mb-20"
            style="min-height: 72px"
          >
          </top-navigation>
        </b-col>
      </b-row>
      <b-row
        xl="12"
        class="h-100"
      >
        <b-col
          class="h-100"
          xl="12"
        >
          <div
            class="h-100"
            @mouseover="mouseOver"
            data-sauto-id="results"
          >
            <Results />
          </div>
        </b-col>
      </b-row>
      <Modal />
    </b-container>
    <b-sidebar
      id="sidebar-1"
      title="Visualization Settings"
      shadow
    >
      <div class="px-3 py-2">
        <h4>Part-of-speech colors</h4>
        <b-row
          v-for="key in Object.keys(posColors)"
          :key="key"
          class="my-3"
        >
          <b-col>{{
            key[0].toUpperCase() + key.slice(1).replace('_', ' ')
          }}</b-col>
          <b-col>
            <b-form-input
              type="color"
              v-model="posColors[key]"
            ></b-form-input>
          </b-col>
        </b-row>
        <h4>Node label options</h4>
        <b-row>
          <b-col>Font size</b-col>
          <b-col>
            <b-form-input
              type="number"
              v-model="labelOptions.fontSize"
              number="true"
            >
            </b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>Bold</b-col>
          <b-col>
            <b-form-checkbox v-model="labelOptions.bold"></b-form-checkbox>
          </b-col>
        </b-row>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import Results from '@/components/Results';
import Modal from '@/components/SautoConfirmationModal';
import TopNavigation from '@/components/TopNavigation';

export default {
  name: 'App',
  components: {
    TopNavigation,
    Results,
    Modal,
  },
  created: function () {
    this.$store.dispatch('main/loadAvailableQueryParams');
  },
  computed: {
    posColors: {
      get() {
        return this.$store.getters['main/posColors'];
      },
    },
    labelOptions: {
      get() {
        return this.$store.getters['main/labelOptions'];
      },
    },
  },
  methods: {},
};
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

html,
body {
  height: 100%;
}
</style>
