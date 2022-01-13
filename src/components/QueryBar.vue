<template>
  <b-row xl='12'>
    <b-col xl='12'>
      <b-row xl='12'>
        <b-col
            data-sauto-id='search-form-1'
            class='pb-1'
            xl='12'
            align-self='stretch'
        >
          <b-row
              class='h-100'
              align-h='center'
              align-v='stretch'
          >
            <b-col>
              <b-row>
                <b-col v-if="type==='EgoNetwork'">
                  <search-form
                      :is-vertical='true'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                  >
                  </search-form>
                </b-col>
                <b-col v-if="type==='GeneralNetworkNetwork'">
                  <search-form-general
                      :is-vertical='true'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                  >
                  </search-form-general>
                </b-col>
                <b-col v-if="type==='GeneralNetworkSpeaker'">
                  <search-form-general-speaker
                      :is-vertical='true'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                  >
                  </search-form-general-speaker>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row xl='12' class="mt-3">
        <b-col
            data-sauto-id='search-form-2'
            class='pb-1'
            xl='12'
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
                  size='sm'
                  variant='secondary'
                  v-if='showSecondButton'
                  v-on:click='queryButtonClicked(2)'
              >
                <b>New Query</b>
              </b-button>
            </b-col>
            <b-col v-if="showSecondForm && type==='EgoNetwork'">
              <search-form
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
              >
              </search-form>
            </b-col>
            <b-col v-if="showSecondForm && type==='GeneralNetworkNetwork'">
              <search-form-general
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
              >
              </search-form-general>
            </b-col>
            <b-col v-if="showSecondForm && type==='GeneralNetworkSpeaker'">
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
  name: "QueryBar",
  props: [],
  components: {
    SearchForm,
    SearchFormGeneral,
    SearchFormGeneralSpeaker
  },
  data() {
    return {
      firstForm: true,
      secondForm: false,
      showInfoButton: false,
    };
  },
  computed: {
    showSecondButton() {
      let numberOfVisualisedNetworks =  this.$store.getters['main/numberOfNetworksVisualised']
      return numberOfVisualisedNetworks > 0;

    },
    showSecondForm() {
      return this.$store.getters['main/secondFormVisibility']
    },
    type() {
      return this.$store.getters['main/topNav'].networkType;
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
    toggleSideBar() {
      this.$parent.$refs.sidebar.classList.toggle('collapsed');
      this.$parent.$refs.main.classList.toggle('full');
    },
    updateShowInfo() {
      this.$store.commit('main/setShowInfo', {showInfo: !this.$store.state.main.showInfo});
    }
  }
}
</script>

<style scoped>

</style>
