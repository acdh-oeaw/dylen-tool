<template>
  <div
    id='app'
    ref='app'
    style='margin-top: 0; height: 95%'
    @mousemove='mouseMove'
    @click='mouseClick'
    @wheel='scroll'
    data-sauto-id='root'
  >
    <div
      ref='main'
      class='main full'
    >
      <b-container
        class='pt-1 pb-5 h-100'
        fluid
      >
        <b-row>
          <b-col>
            <top-navigation
              class='mb-20'
              style='min-height: 72px'
            >
            </top-navigation>
          </b-col>
        </b-row>
        <b-row
          xl='12'
          class='h-100'
        >
          <b-col
            class='h-100'
            xl='12'
          >
            <div
              class='h-100'
              data-sauto-id='results'
            >
              <Results />
            </div>
            <div
              class='h-100 w-100 infoContainer'
              data-sauto-id='info'
              v-if='this.$store.state.main.showInfo'
            >
              <Info />
            </div>
          </b-col>
        </b-row>
        <Modal />
      </b-container>
    </div>

    <div
      ref='sidebar'
      class='sidebar collapsed'
      data-sauto-id='sidebar'
    >
      <div
        class='px-4 py-3'
        style='width: 300px'
      >
        <b-button
          type='button'
          class='close'
          aria-label='Close'
          variant='light'
          @click='toggleSideBar'
          data-sauto-id='sidebar-close-button'
        >
          <span aria-hidden='true'>×</span>
        </b-button>
        <h4 class='mt-3'>Part-of-speech colors</h4>
        <b-row
          v-for='key in Object.keys(posColors)'
          :key='key'
          class='my-3'
        >
          <b-col>{{
              key[0].toUpperCase() + key.slice(1).replace('_', ' ')
            }}
          </b-col>
          <b-col>
            <b-form-input
              :data-sauto-id="'color-option-' + key"
              type='color'
              v-model='posColors[key]'
            ></b-form-input>
          </b-col>
        </b-row>
        <h4 class='mt-3'>Node label options</h4>
        <b-row>
          <b-col>Font size</b-col>
          <b-col>
            <b-form-input
              data-sauto-id='font-option'
              type='number'
              v-model='labelOptions.fontSize'
              :number='true'
            >
            </b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>Bold</b-col>
          <!--Every checkbox needs to have a parent element with ignore as id. Don't ask, it's a workaround-->
          <b-col data-sauto-id='ignore'>
            <b-form-checkbox
              data-sauto-id='bold-checkbox-option'
              v-model='labelOptions.bold'
            ></b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col>White label background</b-col>
          <b-col data-sauto-id='ignore'>
            <b-form-checkbox
              data-sauto-id='white-label-checkbox-option'
              v-model='labelOptions.background'
            ></b-form-checkbox>
          </b-col>
        </b-row>
        <h4 class='mt-3'>Link options</h4>
        <b-row>
          <b-col>Opacity: {{ linkOptions.opacity }}</b-col>
          <b-col>
            <b-form-input
              data-sauto-id='opacity-slider-option'
              type='range'
              v-model='linkOptions.opacity'
              :number='true'
              :min='0'
              :max='1'
              :step='0.1'
            >
            </b-form-input>
          </b-col>
        </b-row>
        <h4 class='mt-3'>Table options</h4>
        <b-row>
          <b-col>
            Number of digits to display:
            {{ tableOptions.digits > 10 ? 'all' : tableOptions.digits }}
          </b-col>
          <b-col>
            <b-form-input
              data-sauto-id='digits-slider-option'
              type='range'
              v-model='tableOptions.digits'
              :number='true'
              :min='0'
              :max='11'
              :step='1'
            >
            </b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>Show selected words on top</b-col>
          <b-col data-sauto-id='ignore'>
            <b-check
              data-sauto-id='selected-words-top-checkbox-option'
              v-model='tableOptions.selectedOnTop'
            >
            </b-check>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import Results from '@/components/Results';
import Modal from '@/components/SautoConfirmationModal';
import TopNavigation from '@/components/TopNavigation';
import Info from '@/components/Info';

export default {
  name: 'App',
  components: {
    TopNavigation,
    Results,
    Modal,
    Info
  },
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('main/loadAvailableCorpora');
    window.addEventListener('resize', this.screenResizeHandler);
  },
  destroyed() {
    window.removeEventListener('resize', this.screenResizeHandler);
  },
  mounted() {
    this.screenResizeHandler();
  },
  computed: {
    posColors: {
      get() {
        return this.$store.getters['main/posColors'];
      }
    },
    labelOptions: {
      get() {
        return this.$store.getters['main/labelOptions'];
      }
    },
    linkOptions: {
      get() {
        return this.$store.getters['main/linkOptions'];
      }
    },
    tableOptions: {
      get() {
        return this.$store.getters['main/tableOptions'];
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$refs.sidebar.classList.toggle('collapsed');
      this.$refs.main.classList.toggle('full');
    },
    screenResizeHandler() {
      const size = this.$refs.app.getBoundingClientRect();
      this.$store.dispatch('sauto/setBoundingClientRect', { size });
    }
  }
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

.sidebar {
  z-index: 6;
  height: 100%; /* 100% Full-height */
  width: 300px; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0;
  right: 0;
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidebar */
  border-left: 5px solid grey;
  background-color: white;
}

.sidebar.collapsed {
  width: 0;
  margin-right: -5px;
}

.main {
  margin-right: 300px;
  transition: margin-right 0.5s; /* If you want a transition effect */
  /*  padding: 20px; */
  height: 100%;
}

.main.full {
  margin-right: 0;
}

.infoContainer {
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  z-index: 10;
  overflow-x: hidden;
}

@media screen and (max-width: 576px) {
  .main {
    margin-right: 0px;
  }
}
</style>
