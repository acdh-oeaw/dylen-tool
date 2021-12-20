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
            <b-navbar-brand href="#">DYLEN</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
              <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                  <b-nav-item href="#" @click='onTypeOfNetworkSelect("EgoNetwork")'>Ego Network</b-nav-item>
                  <b-nav-item href="#" @click='onTypeOfNetworkSelect("GeneralNetworkNetwork")'>General Network</b-nav-item>
                  <b-nav-item href="#" @click='onTypeOfNetworkSelect("GeneralNetworkSpeaker")'>General Network Speaker</b-nav-item>
                </b-navbar-nav>
              </b-collapse>
              <b-row align-h='end'>
                <b-button
                    v-if='showInfoButton'
                    ref='showInfoButton'
                    data-sauto-id='show-info-button'
                    variant='secondary'
                    @click='updateShowInfo'
                    class='mr-1'
                >
                  <b-icon icon='info'></b-icon>
                </b-button>
                <b-button
                    data-sauto-id='settings-button'
                    class='mr-2'
                    @click='toggleSideBar'
                >
                  <b-icon icon='gear'></b-icon>
                </b-button>
              </b-row>
          </b-navbar>

        </b-col>
      </b-row>
      <b-row xl='12' v-if='false'>
        <b-col
            data-sauto-id='search-form-general-1'
            class='pb-1'
            xl='4'
            v-if="typeOfNetwork === 'GeneralNetworkNetwork'"
            align-self='stretch'
        >
          <b-row
              class='h-100'
              align-h='center'
              align-v='stretch'
          >
            <b-col>
              <b-row>
                <b-col>
                  <search-form-general
                      @showInfoButton='setShowInfoButton'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                  >
                  </search-form-general>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col
            data-sauto-id='search-form-general-2'
            class='pb-1'
            xl='4'
            v-if="typeOfNetwork === 'GeneralNetworkNetwork'"
            align-self='stretch'
        >
          <b-row
              class='h-100'
              align-v='center'
          >
            <b-col v-if='!showSecondForm'>
              <b-button
                  pill
                  data-sauto-id='second-query-button-general'
                  v-if='showSecondButton'
                  size='sm'
                  variant='secondary'
                  v-on:click='queryButtonClicked(2)'
              >
                <b>+</b>
              </b-button>
            </b-col>
            <b-col v-if='showSecondForm'>
              <search-form-general
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
              >
              </search-form-general>
            </b-col>
          </b-row>
        </b-col>
        <b-col
            data-sauto-id='search-form-general-speaker-1'
            class='pb-1'
            xl='4'
            v-if="typeOfNetwork === 'GeneralNetworkSpeaker'"
            align-self='stretch'
        >
          <b-row
              class='h-100'
              align-v='center'
          >

            <b-col>
              <search-form-general-speaker
                  :with-labels='false'
                  :pane="'pane' + 1"
                  :is-sidebar='false'
              >
              </search-form-general-speaker>
            </b-col>
          </b-row>
        </b-col>
        <b-col
            data-sauto-id='search-form-general-speaker-2'
            class='pb-1'
            xl='4'
            v-if="typeOfNetwork === 'GeneralNetworkSpeaker'"
            align-self='stretch'
        >
          <b-row
              class='h-100'
              align-v='center'
          >
            <b-col v-if='!showSecondForm'>
              <b-button
                  pill
                  data-sauto-id='second-query-button-general'
                  v-if='showSecondButton'
                  size='sm'
                  variant='secondary'
                  v-on:click='queryButtonClicked(2)'
              >
                <b>+</b>
              </b-button>
            </b-col>
            <b-col v-if='showSecondForm'>
              <search-form-general-speaker
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
              >
              </search-form-general-speaker>
            </b-col>
          </b-row>
        </b-col>

      </b-row>
    </b-col>

  </b-row>
</template>

<script>
import SearchFormGeneral from '@/components/SearchFormGeneral';
import SearchFormGeneralSpeaker from '@/components/SearchFormGeneralSpeaker';

export default {
  name: 'TopNavigation',
  components: {
    SearchFormGeneral,
    SearchFormGeneralSpeaker
  },
  props: ['showInfo'],
  data() {
    return {
      firstForm: true,
      secondForm: false,
      showInfoButton: false,
      typeOfNetwork: 'EgoNetwork'
    };
  },
  created() {
    this.$store.commit('main/changeTopNavType', {
      networkType: this.typeOfNetwork
    });
  },
  computed: {
    showSecondButton() {
      let numberOfVisualisedNetworks =  this.$store.getters['main/numberOfNetworksVisualised']
      return numberOfVisualisedNetworks > 0;

    },
    showSecondForm() {
      return this.$store.getters['main/secondFormVisibility']
    }
  },
  methods: {
    queryButtonClicked(button) {
      if (button === 1) {
        this.firstForm = true;
      } else if (button === 2) {
        this.$store.commit('main/changeSecondFormVisibility', {
          pane: 'pane2'
        })
      }
    },
    onTypeOfNetworkSelect(event) {
      //TODO: use getter from store
      this.typeOfNetwork = event;
      this.$store.commit('main/changeTopNavType', {
        networkType: event
      });
    },
    toggleSideBar() {
      this.$parent.$refs.sidebar.classList.toggle('collapsed');
      this.$parent.$refs.main.classList.toggle('full');
    },
    updateShowInfo() {
      this.$store.commit('main/setShowInfo', { showInfo: !this.$store.state.main.showInfo });
    },
    setShowInfoButton(showInfoButton) {
      this.showInfoButton=showInfoButton;
    }
  }
};
</script>

<style>
.top-nav {
  border-bottom: solid thick;
  border-bottom-color: cadetblue;
}
</style>
