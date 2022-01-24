<template>
  <div
    ref='table'
    style='height: 85%;'
  >
    <b-table
      :items='timeSeriesData'
      :responsive='true'
      :sort-by="'targetword'"
      :fields='fields'
      :filter='filter'
      :filter-function='customFilter'
      :filter-included-fields='filterOn'
      sticky-header='100%'
      head-variant='light'
      small
      hover
      sort-icon-left
      class='h-100 sticky-table'>
      <template #head(targetword)=''>
        <div style='width:8em'>
          <span>Targetword </span>
          <span>
            <b-button
              id='targetword-filter-input'
              style='padding:0'
              variant='none'
              @click='(event) => filterClicked(event, "targetword","filterTargetword")'
            >
              <b-icon v-if='filterOn.indexOf("targetword") < 0' :icon="'filter-circle'"></b-icon>
              <b-icon v-if='filterOn.indexOf("targetword") >= 0' :icon="'filter-circle-fill'"></b-icon>
            </b-button>
            <b-popover target='targetword-filter-input' title='Targetword filter' triggers='click blur'>
              <b-form-group
                label='Filter'
                label-for='filter-input'
                label-cols-sm='3'
                label-align-sm='right'
                label-size='sm'
                class='mb-0'
              >
                <b-input-group size='sm'>
                  <b-form-input
                    id='filter-input'
                    v-model='filterTargetword'
                    type='search'
                    placeholder='Type to Filter'
                    @keypress='e => keyPress(e,"time-series-filter")'
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
            </b-popover>
          </span>
        </div>
      </template>
      <template #head(metric)=''>
        <div style='width:8em'>
          <span>Metric </span>
          <span>
            <b-button
              id='metric-filter-input'
              style='padding:0'
              variant='none'
              @click='(event) => filterClicked(event, "metric","filterMetric")'
            >
              <b-icon v-if='filterOn.indexOf("metric") < 0' :icon="'filter-circle'"></b-icon>
              <b-icon v-if='filterOn.indexOf("metric") >= 0' :icon="'filter-circle-fill'"></b-icon>
            </b-button>
            <b-popover target='metric-filter-input' title='Metric filter' triggers='click blur'>
              <b-form-group
                label='Filter'
                label-for='filter-input'
                label-cols-sm='3'
                label-align-sm='right'
                label-size='sm'
                class='mb-0'
              >
                <b-input-group size='sm'>
                  <b-form-input
                    id='filter-input'
                    v-model='filterMetric'
                    type='search'
                    placeholder='Type to Filter'
                    @keypress='e => keyPress(e,"time-series-filter")'
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
            </b-popover>
          </span>
        </div>
      </template>
      <template #head(relativeTo)=''>
        <div style='width:8em'>
          <span>Relative to </span>
          <span>
            <b-button
              id='relative-to-filter-input'
              style='padding:0'
              variant='none'
              @click='(event) => filterClicked(event, "relativeTo","filterRelativeTo")'
            >
              <b-icon v-if='filterOn.indexOf("relativeTo") < 0' :icon="'filter-circle'"></b-icon>
              <b-icon v-if='filterOn.indexOf("relativeTo") >= 0' :icon="'filter-circle-fill'"></b-icon>
            </b-button>
            <b-popover target='relative-to-filter-input' title='RelativeTo filter' triggers='click blur'>
              <b-form-group
                label='Filter'
                label-for='filter-input'
                label-cols-sm='3'
                label-align-sm='right'
                label-size='sm'
                class='mb-0'
              >
                <b-input-group size='sm'>
                  <b-form-input
                    id='filter-input'
                    v-model='filterRelativeTo'
                    type='search'
                    placeholder='Type to Filter'
                    @keypress='e => keyPress(e,"time-series-filter")'
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
            </b-popover>
          </span>
        </div>
      </template>
      <template #head(year)=''>
        <div style='width:8em'>
          <span>Year </span>
          <span>
            <b-button
              id='year-filter-input'
              style='padding:0'
              variant='none'
              @click='(event) => filterClicked(event, "year","filterYear")'
            >
              <b-icon v-if='filterOn.indexOf("year") < 0' :icon="'filter-circle'"></b-icon>
              <b-icon v-if='filterOn.indexOf("year") >= 0' :icon="'filter-circle-fill'"></b-icon>
            </b-button>
            <b-popover target='year-filter-input' title='Year filter' triggers='click blur'>
              <b-form-group
                label='Filter'
                label-for='filter-input'
                label-cols-sm='3'
                label-align-sm='right'
                label-size='sm'
                class='mb-0'
              >
                <b-input-group size='sm'>
                  <b-form-input
                    id='filter-input'
                    v-model='filterYear'
                    type='search'
                    placeholder='Type to Filter'
                    @keypress='e => keyPress(e,"time-series-filter")'
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
            </b-popover>
          </span>
        </div>
      </template>
      <template #cell(targetword)='row'>
        <span :style='`color: ${row.item.color}`'>{{ row.item.targetword }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
import { roundToMaxDigit } from '@/helpers/utils';

export default {
  name: 'TimeSeriesTable',
  props: ['options'],
  data() {
    return {
      filterTargetword: null,
      filterMetric: null,
      filterRelativeTo: null,
      filterYear: null,
      filterOn: [],
      sortDirection: 'asc'
    };
  },
  methods: {
    filterClicked(event, column, filterName) {
      let i = this.filterOn.indexOf(column);
      if (i < 0) {
        this.filterOn.push(column);
      } else {
        this.filterOn.splice(i, 1);
        this[filterName] = null;
      }
      this.mouseClick(event, 'time-series-filter');
      event.stopPropagation();
    },
    customFilter(row, filter) {
      const targetwordCheck = filter[0] !== null ? row.targetword.toLowerCase().startsWith(filter[0].toLowerCase()) : null;
      const metricCheck = filter[1] !== null ? row.metric.toLowerCase().startsWith(filter[1].toLowerCase()) : null;
      const relativeToCheck = filter[2] !== null ? row.relativeTo.toLowerCase().startsWith(filter[2].toLowerCase()) : null;
      const yearCheck = filter[3] !== null ? row.year.toLowerCase().startsWith(filter[3].toLowerCase()) : null;


      return (targetwordCheck || targetwordCheck === null) && (metricCheck || metricCheck === null)
        && (relativeToCheck || relativeToCheck === null) && (yearCheck || yearCheck === null);
    }
  },
  computed: {
    filter: function() {
      if (this.filterTargetword === null && this.filterMetric === null && this.filterRelativeTo == null && this.filterYear) {
        return null;
      }

      return [this.filterTargetword, this.filterMetric, this.filterRelativeTo, this.filterYear];
    },
    fields() {
      if (this.timeSeriesData.length <= 0) return [];
      let fields = [];
      for (let key in this.timeSeriesData[0]) {
        if (key !== 'color')
          fields.push({
            key,
            sortable: true
          });
      }
      return fields;
    },
    tableOptions() {
      return this.$store.getters['main/tableOptions'];
    },
    timeSeriesData() {
      return ['pane1', 'pane2']
        .map((p) => {
          let rows = [];

          let ts = this.$store.getters['main/timeSeriesData'](p);
          let label = this.$store.getters['main/selectedTargetword'](p)?.text;
          let color = p === 'pane1' ? this.$store.getters['main/selectionColors'][0] : this.$store.getters['main/selectionColors'][1];

          for (const key of Object.keys(ts)) {
            for (const [relationToKey, relationToValue] of Object.entries(ts[key])) {
              let rowList = relationToValue.map(v => {
                let metricValue = roundToMaxDigit(v['value'], this.tableOptions.digits);
                return {
                  'targetword': label,
                  'metric': key,
                  'relativeTo': relationToKey,
                  'year': v['year'],
                  'value': metricValue,
                  'color': color
                };
              });
              rows = rows.concat(rowList);
            }
          }
          return rows;
        })
        .flat();
    }
  }
};
</script>

<style scoped>
.sticky-table td {
  background-color: white;
}

.sticky-table tr td:first-child,
.sticky-table th:first-child {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}

.sticky-table th:first-child {
  z-index: 4 !important;
}

.sticky-table tr td:nth-child(2),
.sticky-table th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 66px;
  z-index: 2;
}

.sticky-table th:nth-child(2) {
  z-index: 4 !important;
}
</style>
