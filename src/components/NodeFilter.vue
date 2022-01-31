<template>
  <b-card class='mt-0 mx-0 px-0 pt-0 nodefilter'>
    <b-row
      xl='12'
      class='mx-0 px-0 pt-0 mt-0'
    >
      <b-col
        xl='12'
        class='mt-0 text-center pt-0'
        style='font-size:0.9em'
      >
        <info-icon
          size='1.2x'
          class='custom-class'
          aria-label='Node Filter info button'
          style='color:red'
          v-b-modal="'threshold-'+this.pane"
          data-sauto-id='node-filter-info'
        ></info-icon>
        <b> Node filter</b>
      </b-col>
    </b-row>
    <b-row xl='12'>
      <b-col
        xl='12'
        class='pt-2'
        style='font-size:0.9em'
      >
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
            data-sauto-id='metricGeneralOption'
          >
            {{ option }}
          </b-form-select-option>
        </b-form-select>
      </b-col>
    </b-row>
    <b-row
      xl='12'
      class='mt-0'
    >
      <b-col
        xl='12'
        class='mt-3 mb-2'
        style='font-size:0.9em'
      >
        % of nodes to display:
        <b-row xl='12'>
          <b-col
            xl='12'
            class='text-center'
          >
            <b-badge
              variant='warning'
              style='font-size: 0.7em'
            >Use with caution
            </b-badge>
          </b-col>
        </b-row>

        <b-modal
          :id='"threshold-"+this.pane'
          title='Node filter with threshold slider'
          ok-only
        >
          <b-row xl='12'>
            <b-col
              xl='12'
              class='text-center'
            >
              <alert-triangle-icon
                size='2x'
                class='custom-class'
                style='color: #E2CD0D'
              ></alert-triangle-icon>
              Caution<br>
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
    <b-row
      xl='12'
      class='mx-0 px-0'
    >
      <b-col
        xl='12'
        class='mt-2 pb-4'
      >
        <Slider
          :class="stepsize ? 'no-fill' : ''"
          @change='valueChanged'
          :format='sliderFormat'
          showTooltip='always'
          tooltipPosition='bottom'
          v-model='valueSlid'
          :max="maximum"
          data-sauto-id='ignore'
          :merge="15"
          ref='nodeFilterSlider'
        />
      </b-col>

    </b-row>
  </b-card>
</template>

<script>
import { InfoIcon, AlertTriangleIcon } from 'vue-feather-icons';
import Slider from '@vueform/slider/dist/slider.vue2.js';
import { GENERAL_SPEAKER } from '@/helpers/mixins';
const logger = require('../helpers/logger');
export default {
  components: { InfoIcon, AlertTriangleIcon, Slider },
  name: 'NodeFilter',
  props: [
    'availableMetrics',
    'pane',
    'generalType',
    'stepsize',
    'initialValueSlid'
  ],
  data() {
    return {
      defaultMetric: 'Degree Centrality',
      maximum: this.stepsize !== undefined ? 100 - this.stepsize : 100,
      valueSlid: [this.initialValueSlid[0], this.initialValueSlid[1]],
      oldValue1: 0,
    };
  },
  mounted() {
    let selectedMetric = this.getMetricByType(this.generalType);
    this.selectedMetric =
      selectedMetric.metric === '' ? this.defaultMetric : selectedMetric.metric;

    this.$root.$on('networkTypeChanged', () => {
      this.selectedMetric = this.defaultMetric;
    });
  },
  methods: {
    valueChanged() {
      if (this.stepsize !== undefined)
        this.$emit('sliderValueChanged', [
          this.$data.valueSlid,
          this.$data.valueSlid + this.stepsize
        ]);
      else this.$emit('sliderValueChanged', this.$data.valueSlid);

      let changedValue = 0;
      if(this.oldValue1===this.$data.valueSlid[0]){
        changedValue=this.$data.valueSlid[1]
      }else{
        changedValue=this.$data.valueSlid[0]
        this.oldValue1=this.$data.valueSlid[0]
      }

      const event = this.calculateSliderPosition(changedValue);
      this.mouseClick(event, 'node-filter-slider'+this.pane);
    },
    calculateSliderPosition(value) {
      //im sorry for this hacky workaround but slider doesnt register drags correctly
      const sizes = this.$refs.nodeFilterSlider.$el.getBoundingClientRect();
      //x, y, width, height
      const clientY = sizes.y;

      const clientX = ((value) * sizes.width) / 100 + sizes.x;
      //this calculation works with an error margin of couple of pixels
      //to be honest im disgusted and proud of this method
      return {
        clientX,
        clientY
      };
    },
    getMetricByType(entityType) {
      if (entityType === GENERAL_SPEAKER) {
        return this.$store.getters['main/selectedGeneralNetworkSpeakerMetric'](
          this.pane
        );
      } else {
        return this.$store.getters['main/selectedGeneralNetworkMetric'](
          this.pane
        );
      }
    }
  },
  computed: {
    sliderFormat() {
      if (this.stepsize != undefined) {
        const s = this.stepsize;
        return (value) => {
          return `${Math.round(value)}% - ${Math.round(value + s)}%`;
        };
      } else {
        return (value) => {
          return `${Math.round(value)}%`;
        };
      }
    },
    selectedMetric: {
      get() {
        return this.getMetricByType(this.generalType);
      },
      set(val) {
        if (val) {
          if (this.generalType === GENERAL_SPEAKER) {
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
          logger.log('Set metric to: ' + val);
        }
      }
    }
  }
};
</script>

<style>
.nodefilter.card .card-body {
  padding-top: 0.5rem !important;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

.no-fill .slider-connect {
  background-color: unset;
}
</style>
