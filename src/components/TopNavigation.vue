<template>
  <b-row
    xl='12'
    class='top-nav'
    align-h='center'
    align-v='stretch'
    data-sauto-id='top-navigation'
  >
    <b-col
      xl='1'
      align-self='center'
    >
      <h2><b>DYLEN</b></h2>
    </b-col>
    <b-col
      @mouseover='mouseOver'
      data-sauto-id='search-form-1'
      class='pb-1'
      xl='5'
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
    <b-col
      @mouseover='mouseOver'
      data-sauto-id='search-form-2'
      class='pb-1'
      xl='5'
      align-self='stretch'
    >
      <b-row
        class='h-100'
        align-v='center'
      >
        <b-col v-if='!secondForm'>
          <b-button
            data-sauto-id='second-query-button'
            v-if='firstForm && !secondForm'
            size='sm'
            variant='secondary'
            v-on:click='queryButtonClicked(2)'
          >
            <b>+</b>
          </b-button>
        </b-col>
        <b-col v-else>
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
      xl='1'
      align-self='center'
    >
      <b-row>
        <b-button
          v-if='showInfoButton'
          ref='showInfoButton'
          data-sauto-id='show-info-button'
          variant='secondary'
          @click='updateShowInfo'
        >
          <b-icon icon='info'></b-icon>
        </b-button>
        <b-button
          data-sauto-id='settings-button'
          class='float-right'
          @click='toggleSideBar'
        >
          Settings
        </b-button>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import SearchForm from '@/components/SearchForm';

export default {
  name: 'TopNavigation',
  components: {
    SearchForm
  },
  props: ['showInfo'],
  data() {
    return {
      firstForm: true,
      secondForm: false,
      showInfoButton: false
    };
  },
  methods: {
    queryButtonClicked(button) {
      if (button === 1) {
        this.firstForm = true;
      } else if (button === 2) {
        this.secondForm = true;
      }
    },
    toggleSideBar() {
      this.$parent.$refs.sidebar.classList.toggle('collapsed');
      this.$parent.$refs.main.classList.toggle('full');
    },
    updateShowInfo() {
      this.$store.commit('main/setShowInfo', { showInfo: !this.$store.state.main.showInfo });
    },
    setShowInfoButton() {
      this.showInfoButton=true;
    }
  }
};
</script>

<style>
.top-nav {
  height: 100%;
  border-bottom: solid thick;
  border-bottom-color: grey;
}
</style>
