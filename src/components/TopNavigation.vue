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
        <b-col
            xl='1'
            align-self='center'
        >
          <b-row
              class='h-100'
              align-h='center'
              align-v='stretch'>
            <h4><b>DYLEN</b></h4>
          </b-row>
        </b-col>
        <b-col
            xl='1'
            align-self='center'
        >
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
        </b-col>
      </b-row>
      <b-row xl='12'>
        <b-col
            data-sauto-id='search-form-2'
            class='pb-1'
            xl='5'
            v-if="typeOfNetwork == 'EgoNetwork'"
            align-self='stretch'
        >
          <b-row
              class='h-100'
              align-v='center'
          >
            <b-col v-if='!showSecondForm'>
              <b-button
                  pill
                  data-sauto-id='second-query-button'
                  v-if='showSecondButton'
                  size='sm'
                  variant='secondary'
                  v-on:click='queryButtonClicked(2)'
              >
                <b>+</b>
              </b-button>
            </b-col>
            <b-col v-if='showSecondForm'>
              <search-form
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
              >
              </search-form>
            </b-col>
          </b-row>
        </b-col>
        <b-col
            data-sauto-id='search-form-general-1'
            class='pb-1'
            xl='4'
            v-if="typeOfNetwork == 'GeneralNetworkNetwork'"
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
            v-if="typeOfNetwork == 'GeneralNetworkNetwork'"
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
            v-if="typeOfNetwork == 'GeneralNetworkSpeaker'"
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
            v-if="typeOfNetwork == 'GeneralNetworkSpeaker'"
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
import SearchForm from '@/components/SearchForm';
import SearchFormGeneral from '@/components/SearchFormGeneral';
import SearchFormGeneralSpeaker from '@/components/SearchFormGeneralSpeaker';

export default {
  name: 'TopNavigation',
  components: {
    SearchForm,
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
  computed: {
    showSecondButton() {
      let numberOfVisualisedNetworks =  this.$store.getters['main/numberOfNetworksVisualised']
      if (numberOfVisualisedNetworks > 0) {
        return true;
      }
      return false;
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
      this.typeOfNetwork = event.target.value;
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
  border-bottom-color: grey;
}
.search-form {
  height: 100%;
  border-bottom: solid thick;
  border-bottom-color: grey;
}
</style>
