<template>
  <b-card class='mt-0'>
    <b-row xl='12'>
      <b-col xl=12 class='mt-0 text-center' style='font-size:0.9em'>
        <info-icon size="1.2x" class="custom-class" style='color:red' v-b-modal.threshold></info-icon>
        <b> Node filter</b>
      </b-col>
    </b-row>
    <b-row xl='12'>
      <b-col xl=12 class='pt-2' style='font-size:0.9em'>
        Metric:
        <b-form-select
            size='sm'
            v-model='selectedMetric'
            :data-sauto-id="'selectGeneralMetric-'+this.pane"
        >
          <b-form-select-option
              v-for='option in availableMetrics'
              v-bind:key='option.id'
              v-bind:value='option'
              :data-sauto-id="'metricGeneralOption-' + option"
          >
            {{ option }}
          </b-form-select-option>
        </b-form-select>
      </b-col>
    </b-row>
    <b-row xl='12' class='mt-2'>
      <b-col xl=12 class='mt-3 mb-2' style='font-size:0.9em'>
        % of nodes to display:
        <b-row xl='12'>
          <b-col
            xl='12'
            class='text-center'
          >
            <b-badge
                variant="warning"
                style='font-size: 0.7em'
            >Use with caution</b-badge>
          </b-col>
        </b-row>

        <b-modal id='threshold' title='Node filter with threshold slider'>
          <b-row xl='12'>
            <b-col
              xl='12'
              class='text-center'
            >
              <alert-triangle-icon size="2x" class="custom-class" style='color: #E2CD0D'></alert-triangle-icon> Caution<br>
            </b-col>
          </b-row>
          General Network graphs consist of large number of nodes and edges. <br>
          Visualizing such large graphs can be computation intensive and depending on the computational resources,
          the visualization might take longer time or might freeze the browser. <br>
          <hr>
          The threshold slider lets you select which nodes you want to visualize. <br>
          For example, if you want to view top 10% nodes with the highest degress centrality,
          you should select 'degrees centrality' from the drop down selector and move the slider and select
          90 - 100%
        </b-modal>
      </b-col>
    </b-row>
    <b-row xl='12'>
      <b-col xl='12' class='mt-2 pb-4'>
        <Slider
            @change='valueChanged'
            :format="sliderFormat"
            showTooltip="always"
            tooltipPosition="bottom"
            v-model="valueSlid"/>
      </b-col>

    </b-row>
  </b-card>
</template>

<script>
import {InfoIcon, AlertTriangleIcon} from 'vue-feather-icons'
import Slider from '@vueform/slider/dist/slider.vue2.js';

export default {
  components: {InfoIcon, AlertTriangleIcon, Slider},
  name: "NodeFilter",
  props: ['availableMetrics', 'pane', 'generalType'],
  data() {
    return {
      valueSlid: [0,20],
      sliderFormat: function (value) {
        return `${Math.round(value)}%`
      }
    }
  },
  mounted() {
    let defaultMetric = "Degree Centrality";

    let selectedMetric = this.getMetricByType(this.generalType);

    this.selectedMetric = selectedMetric.metric === ""? defaultMetric : selectedMetric.metric

  },
  methods: {
    valueChanged() {
      this.$emit('sliderValueChanged', this.$data.valueSlid);
    },
    getMetricByType(entityType) {
      if (entityType === "speaker") {
        return this.$store.getters['main/selectedGeneralNetworkSpeakerMetric'](this.pane)
      } else {
        return this.$store.getters['main/selectedGeneralNetworkMetric'](this.pane);
      }
    }
  },
  computed: {
    selectedMetric: {
      get() {
        return this.getMetricByType(this.generalType)
      },
      set(val) {
        if (val) {
          if (this.generalType === "speaker") {
            this.$store.commit('main/changeSelectedSpeakerMetric', {
              metric: val,
              pane: this.pane
            });
          } else {
            this.$store.commit('main/changeSelectedMetric', {
              metric: val,
              pane: this.pane
            });
          }

          console.log('Set metric to: ' + val);
        }
      }
    },
  }
}
</script>

<style scoped>

</style>