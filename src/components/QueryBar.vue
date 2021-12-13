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
                <b-col>
                  <search-form
                      @showInfoButton='setShowInfoButton'
                      :is-vertical='true'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                  >
                  </search-form>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row xl='12'>
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
            <b-col v-if='showSecondForm'>
              <search-form
                  :is-vertical='true'
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
              >
              </search-form>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-col>
  </b-row>

</template>

<script>
import SearchForm from '@/components/SearchForm';

export default {
  name: "QueryBar",
  props: ['showInfo'],
  components: {
    SearchForm,
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
    },
    setShowInfoButton(showInfoButton) {
      this.showInfoButton = showInfoButton;
    }
  }
}
</script>

<style scoped>

</style>