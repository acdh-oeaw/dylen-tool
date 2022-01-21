<template>
  <b-row
    xl='12'
    class='search-form'
    align-h='center'
    align-v='stretch'
    data-sauto-id='top-navigation'
  >
    <b-col xl='12'>
      <b-row
          xl='12'
          class='top-nav'>
        <b-col xl='12'>
          <b-navbar toggleable="sm" type="dark" variant="info">
            <b-navbar-brand href="#" class='pr-3 pt-2'>DYLEN</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
              <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                  <b-nav-item href="#" @click='onTypeOfNetworkSelect(EGO_NETWORK)'>Ego Network</b-nav-item>
                  <b-nav-item href="#" @click='onTypeOfNetworkSelect(GENERAL_PARTY)'>General Network</b-nav-item>
                  <b-nav-item href="#" @click='onTypeOfNetworkSelect(GENERAL_SPEAKER)'>General Network Speaker</b-nav-item>
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
                  <b-icon icon='info' class='pr-0 mr-0'></b-icon>
                </b-button>
                <setting
                    setting-component='all'
                    position='nav'>
                </setting>
              </b-row>
          </b-navbar>

        </b-col>
      </b-row>
    </b-col>

  </b-row>
</template>

<script>
import Setting from '@/components/Setting'
import {EGO_NETWORK, networkTypeMixin} from "@/helpers/mixins";

export default {
  mixins: [networkTypeMixin],
  name: 'TopNavigation',
  components: {
    Setting
  },
  props: ['showInfo'],
  data() {
    return {
      typeOfNetwork: EGO_NETWORK
    };
  },
  created() {
    this.$store.commit('main/changeTopNavType', {
      networkType: this.typeOfNetwork
    });
  },
  computed: {
    showInfoButton() {
      return this.$store.getters['main/showInfoButton']
    }
  },
  methods: {
    onTypeOfNetworkSelect(networkTypeEvent) {
      this.typeOfNetwork = networkTypeEvent;
      this.$store.commit('main/changeTopNavType', {
        networkType: networkTypeEvent
      });
      this.$root.$emit('networkTypeChanged', event)
    },
    toggleSideBar() {
      this.$parent.$refs.sidebar.classList.toggle('collapsed');
      this.$parent.$refs.main.classList.toggle('full');
    },
    updateShowInfo() {
      this.$store.commit('main/setShowInfo', { showInfo: !this.$store.state.main.showInfo });
    }
  }
};
</script>

<style>
.top-nav {
  border-bottom: solid thick;
  border-bottom-color: lightgrey;
}
</style>
