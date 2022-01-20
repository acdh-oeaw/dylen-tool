<template>
  <div
    id='app'
    ref='app'
    style='margin-top: 0; height: 90%'
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
        class='pb-5 h-100 pr-0 pl-0'
        fluid
      >
        <b-row>
          <b-col>
            <top-navigation>
            </top-navigation>
          </b-col>
        </b-row>
        <b-row
          xl='12'
          class='pl-3 pt-0 h-100'
          style='border-color: darkgrey; border-bottom: solid'
        >
          <b-col
            xl='2'
            class='pt-0 mt-0'
            style='border-right: solid; border-color: darkgrey'
          >
            <query-bar></query-bar>
          </b-col>
          <b-col
            class='h-100'
            xl='10'
          >
            <div
              class='h-100 pr-4'
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
        <b-row class='mb-1 py-3' style='background-color: #17a2b8; color: white'>
          <b-col xl='11'>
            <b-row xl='12'>
              <b-col xl='12' class='text-right pr-4'>
                The Dylen project is funded by the ÖAW go!digital Next Generation grant (GDNG 2018-020)
              </b-col>
            </b-row>
            <b-row xl='12' class='pb-1 mb-1'>
              <b-col
                  xl='12'
                  class='text-right pr-4'
              >
                <a href='https://dylen.acdh.oeaw.ac.at/about/' target='_blank'>More about the project | </a>
                <a href="https://dylen.acdh.oeaw.ac.at/imprint" target="_blank">Imprint | </a>
                <a href='mailto:acdh-helpdesk@oeaw.ac.at' target='_black'>Helpdesk</a>
              </b-col>
            </b-row>
          </b-col>
          <b-col xl='1'>
            <a href="http://www.oeaw.ac.at/" target="_blank"><img class='partner-logos' style='max-width:40%; height:auto' src="@/assets/acdh-ch-logo96.png" alt=""></a>
          </b-col>
        </b-row>

      </b-container>
    </div>
    <div
      ref='sidebar'
      class='sidebar collapsed'
      data-sauto-id='sidebar'
    >
      <div
        class='pr-4 pl-1 py-3'
        style='width: 300px'
      >
        <b-row
          xl='12'
          align-content='end'
        >
          <b-col xl='12'>
            <b-button
              type='button'
              class='close'
              aria-label='Close'
              variant='light'
              @click='toggleSideBar(activeSettings)'
              data-sauto-id='sidebar-close-button'
            >
              <span aria-hidden='true'>×</span>
            </b-button>
          </b-col>
        </b-row>
        <b-row xl='12'>
          <b-col xl='12'>
            <b-row
              xl='12'
              v-if='activeSettings === "egoNetwork" || activeSettings === "all"'
            >
              <b-col xl='12'>
                <b-card
                  header='Ego network options'
                  header-bg-variant='info'
                  header-text-variant='white'
                >
                  <h6 class='mt-3'>Part-of-speech colors</h6>
                  <b-row
                    v-for='key in Object.keys(posColors)'
                    :key='key'
                    class='my-3 mr-0 pr-0'
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
                </b-card>
              </b-col>
            </b-row>
            <b-row v-if='activeSettings === "egoNetwork" || activeSettings === "all"'>
              <b-col>
                <b-card
                  header='Node label options'
                  header-bg-variant='info'
                  header-text-variant='white'
                >
                  <b-row class='pt-3'>
                    <b-col
                      xl='6'
                      class='text-right'
                    >Font size </b-col>
                    <b-col>
                      <b-form-input
                        data-sauto-id='font-option'
                        type='number'
                        v-model='labelOptions.fontSize'
                        size='sm'
                      >
                      </b-form-input>
                    </b-col>
                  </b-row>
                  <b-row class='pt-3'>
                    <b-col
                      xl='6'
                      class='text-right'
                    >Bold</b-col>
                    <!--Every checkbox needs to have a parent element with ignore as id. Don't ask, it's a workaround-->
                    <b-col data-sauto-id='ignore'>
                      <b-form-checkbox
                        data-sauto-id='bold-checkbox-option'
                        v-model='labelOptions.bold'
                      ></b-form-checkbox>
                    </b-col>
                  </b-row>
                  <b-row class='pt-3'>
                    <b-col
                      xl='6'
                      class='text-right'
                    >White label background</b-col>
                    <b-col data-sauto-id='ignore'>
                      <b-form-checkbox
                        data-sauto-id='white-label-checkbox-option'
                        v-model='labelOptions.background'
                      ></b-form-checkbox>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
            <b-row v-if='activeSettings === "egoNetwork" || activeSettings === "all"'>
              <b-col>
                <b-card
                  header='Link options'
                  header-bg-variant='info'
                  header-text-variant='white'
                >
                  <b-row class='pt-3'>
                    <b-col
                      xl='6'
                      class='text-right'
                    >Opacity: {{ linkOptions.opacity }}</b-col>
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
                </b-card>
              </b-col>
            </b-row>
            <b-row v-if='activeSettings === "nodeMetrics" || activeSettings === "all"'>
              <b-col>
                <b-card
                  header='Table options'
                  header-bg-variant='info'
                  header-text-variant='white'
                >
                  <b-row class='pt-3'>
                    <b-col
                      xl='7'
                      class='text-right'
                    >
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
                  <b-row class='pt-3'>
                    <b-col
                      xl='7'
                      class='text-right'
                    >Show selected words on top</b-col>
                    <b-col data-sauto-id='ignore'>
                      <b-check
                        data-sauto-id='selected-words-top-checkbox-option'
                        v-model='tableOptions.selectedOnTop'
                      >
                      </b-check>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card
                  header='Parallel coordinates options'
                  header-bg-variant='info'
                  header-text-variant='white'
                >
                  <b-row>Axes to display (drag to reorder):</b-row>
                  <draggable
                    :list="selectedMetrics"
                    @start="drag=true"
                    @end="drag=false"
                    class="list-group w-100"
                    :disabled="false"
                  >
                    <div
                      class="list-group-item w-100"
                      v-for="element in selectedMetrics"
                      :key="element.name"
                    >{{camelCaseToSpaces(element.name)}}
                      <b-form-checkbox
                        v-model="element.enabled"
                        switch
                      >
                        {{element.enabled ? "Enabled" : "Disabled"}}
                      </b-form-checkbox>
                    </div>
                  </draggable>
                </b-card>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </div>
    <alert-area></alert-area>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Results from '@/components/Results';
import Modal from '@/components/SautoConfirmationModal';
import TopNavigation from '@/components/TopNavigation';
import Info from '@/components/Info';
import QueryBar from '@/components/QueryBar';
import AlertArea from '@/components/AlertArea';
import { camelCaseToSpaces } from '@/helpers/utils';

export default {
  name: 'App',
  components: {
    QueryBar,
    TopNavigation,
    Results,
    Modal,
    Info,
    draggable,
    AlertArea
  },
  data() {
    return {
      drag: false,
      camelCaseToSpaces: camelCaseToSpaces
    };
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
    },
    activeSettings: {
      get() {
        return this.$store.getters['main/activeSettings'];
      }
    },
    settingsActive: {
      get() {
        return this.$store.getters['main/settingsActive'];
      }
    },
    selectedMetrics: {
      get() {
        return this.$store.getters['main/parallelCoordinateMetrics'];
      },
      set(value) {
        console.log(value);
        this.$store.commit('main/setParallelCoordinateMetrics', value);
      }
    }
  },
  methods: {
    toggleSideBar(component) {
      this.$store.commit('main/changeActiveSettings', { component: component });
    },
    screenResizeHandler() {
      const size = this.$refs.app.getBoundingClientRect();
      this.$store.dispatch('sauto/setBoundingClientRect', { size });
    }
  },
  watch: {
    settingsActive: function (newVal, oldVal) {
      console.log('settings changed: ' + newVal + oldVal);
      this.$refs.sidebar.classList.toggle('collapsed');
      this.$refs.main.classList.toggle('full');
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
.settings-button {
  margin-right: 2.5em;
  margin-bottom: 0.5em;
  z-index: 2;
  position: absolute;
  right: 0;
}

@media screen and (max-width: 576px) {
  .main {
    margin-right: 0px;
  }
}

a:link {
  color: white;
}
</style>
