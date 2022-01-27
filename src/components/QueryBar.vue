<template>
  <b-row
    xl='12'
    class="w-100 mx-auto"
  >
    <b-col
      xl='12'
      class="pl-2"
    >
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
                <b-col v-if="type===EGO_NETWORK">
                  <b-card class='mt-2'>
                    <search-form
                      :is-vertical='true'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                      @visualizeClicked='validateFormVisibility'
                    >
                    </search-form>
                  </b-card>
                </b-col>
                <b-col v-if="type===GENERAL_PARTY">
                  <b-card class='mt-2 px-0'>
                    <search-form-general
                      :is-vertical='true'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                      @visualizeClicked='validateFormVisibility'
                    >
                    </search-form-general>
                  </b-card>

                </b-col>
                <b-col
                  v-if="type===GENERAL_SPEAKER"
                  class='mt-2'
                >
                  <b-card>
                    <search-form-general-speaker
                      :is-vertical='true'
                      :with-labels='false'
                      :pane="'pane' + 1"
                      :is-sidebar='false'
                      @visualizeClicked='validateFormVisibility'
                    >
                    </search-form-general-speaker>
                  </b-card>

                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row
        xl='12'
        class="mt-3"
      >
        <b-col
          data-sauto-id='search-form-2'
          class='pb-1'
          xl='12'
          align-self='stretch'
        >
          <b-row
            xl='12'
            class='h-100'
            align-v='center'
          >
            <b-col
              xl='12'
              v-if='!secondFormVisibility'
            >
              <b-button
                pill
                data-sauto-id='second-query-button'
                size='sm'
                variant='secondary'
                v-if='secondFormVisibility'
                v-on:click='queryButtonClicked(2)'
              >
                <b>New Query</b>
              </b-button>
            </b-col>
            <b-col
              xl='12'
              v-if="secondFormVisibility && type===EGO_NETWORK"
            >
              <b-card>
                <search-form
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
                >
                </search-form>
              </b-card>

            </b-col>
            <b-col
              xl='12'
              v-if="secondFormVisibility && type===GENERAL_PARTY"
            >
              <b-card>
                <search-form-general
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
                >
                </search-form-general>
              </b-card>

            </b-col>
            <b-col v-if="secondFormVisibility && type===GENERAL_SPEAKER">
              <b-card>
                <search-form-general-speaker
                  :with-labels='false'
                  :pane="'pane' + 2"
                  :is-sidebar='false'
                >
                </search-form-general-speaker>
              </b-card>

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
import { networkTypeMixin } from '@/helpers/mixins';

export default {
  mixins: [networkTypeMixin],
  name: 'QueryBar',
  props: [],
  components: {
    SearchForm,
    SearchFormGeneral,
    SearchFormGeneralSpeaker
  },
  data() {
    return {
      firstForm: true,
      secondForm: false
    };
  },
  mounted() {
    this.$root.$on('visualizeClicked', () => {
      let numberOfVisualisedNetworks =
        this.$store.getters['main/numberOfNetworksVisualised'];
      if (numberOfVisualisedNetworks > 0) {
        this.secondForm = true;
      }
    });
  },
  computed: {
    type() {
      return this.$store.getters['main/topNav'].networkType;
    },
    secondFormVisibility() {
      return this.secondForm;
    }
  },
  methods: {
    validateFormVisibility() {
      let numberOfVisualisedNetworks =
        this.$store.getters['main/numberOfNetworksVisualised'];
      if (numberOfVisualisedNetworks > 0) {
        this.secondForm = true;
      }
    },
    queryButtonClicked(button) {
      if (button === 1) {
        this.firstForm = true;
      } else if (button === 2) {
        this.secondForm = true;
      }
    }
  }
};
</script>

<style scoped>
</style>
