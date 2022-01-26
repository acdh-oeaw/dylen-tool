<template>
  <b-row
      xl='12'
      class='search-form w-100 mx-0'
      align-h='center'
      align-v='stretch'
      data-sauto-id='top-navigation'
  >
    <b-col xl='12'>
      <b-row
          xl='12'
          class='top-nav'
      >
        <b-col
            xl='12'
            class="px-0"
        >
          <b-navbar
              toggleable="sm"
              type="dark"
              variant="info"
          >
            <b-navbar-brand
                href="#"
                class='pr-3 pt-2'
                style='max-width:150px'
            >
              <img
                  src='@/assets/dylen_white.png'
                  style='max-width:100%;height:auto'/>
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse
                id="nav-collapse"
                is-nav
            >
              <b-navbar-nav>
                <b-nav-item
                    href="#"
                    :class='this.typeOfNetwork === EGO_NETWORK ? "selected" : "notselected"'
                    @click='onTypeOfNetworkSelect(EGO_NETWORK)'
                >Ego Network
                </b-nav-item>
                <b-nav-item
                    :class='this.typeOfNetwork === GENERAL_PARTY ? "selected" : "notselected"'
                    href="#"
                    @click='onTypeOfNetworkSelect(GENERAL_PARTY)'
                >General Network (Party)
                </b-nav-item>
                <b-nav-item
                    :class='this.typeOfNetwork === GENERAL_SPEAKER ? "selected" : "notselected"'
                    href="#"
                    @click='onTypeOfNetworkSelect(GENERAL_SPEAKER)'
                >General Network (Speaker)
                </b-nav-item>
              </b-navbar-nav>
            </b-collapse>
            <b-navbar-toggle target="nav-collapse-2"></b-navbar-toggle>
            <b-collapse
                is-nav
            >
              <b-navbar-nav class='ml-auto mr-3'>
                <b-nav-text class='d-inline-flex flex-column'>
                    <span class='mr-2 dysen'>
                      Check our our sister project <br> for sentiment analysis: <a href="https://dysen-tool.acdh.oeaw.ac.at" target="_blank">DYSEN</a>
                    </span>
                </b-nav-text>
              </b-navbar-nav>
            </b-collapse>
            <b-row align-h='end'>
              <b-button
                  v-if='showInfoButton'
                  ref='showInfoButton'
                  data-sauto-id='show-info-button'
                  variant='info'
                  @click='updateShowInfo'
                  class='px-1 mx-1'
                  style='z-index: 1'
              >
                <info-icon
                    size='1.5x'
                    class='custom-class'
                    style='color:white; margin-right: 0;'></info-icon>
              </b-button>
              <setting
                  class='px-0 mx-0'
                  setting-component='all'
                  position='nav'
              >
              </setting>
            </b-row>
          </b-navbar>

        </b-col>
      </b-row>
    </b-col>

  </b-row>
</template>

<script>
import Setting from '@/components/Setting';
import {networkTypeMixin} from '@/helpers/mixins';
import {InfoIcon} from 'vue-feather-icons';

export default {
  mixins: [networkTypeMixin],
  name: 'TopNavigation',
  components: {
    InfoIcon,
    Setting
  },
  props: ['showInfo'],
  data() {
    return {
      typeOfNetwork: null
    };
  },
  created() {
  },
  computed: {
    showInfoButton() {
      return this.$store.getters['main/showInfoButton'];
    },
  },
  methods: {
    onTypeOfNetworkSelect(networkTypeEvent) {
      this.typeOfNetwork = networkTypeEvent;
      this.$store.commit('main/changeTopNavType', {
        networkType: networkTypeEvent
      });
      this.$root.$emit('networkTypeChanged', event);
    },
    updateShowInfo() {
      this.$store.commit('main/setShowInfo', {
        showInfo: !this.$store.state.main.showInfo
      });
    }
  }
};
</script>

<style>
.top-nav {
  border-bottom: solid thick;
  border-bottom-color: lightgrey;
}
.dysen {
  color: white
}
.nav-item.dysen .nav-link:hover, .nav-item.dysen .nav-link:focus, .nav-item.dysen .nav-link {
  color: white !important;
}

.nav-item.dysen .nav-link {
  color: white !important;
}

.nav-item.selected .nav-link:hover, .nav-item.selected .nav-link:focus, .nav-item.selected .nav-link {
  font-weight: 800 !important;
  border: solid !important;
  color: white !important;
}

.nav-item.notselected .nav-link {
  color: white !important;
}
</style>
