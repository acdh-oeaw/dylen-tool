<template>
  <div
      ref='table'
      style="height: 85%;"
  >
    <b-table
        :responsive='true'
        :sort-by="'Targetword'"
        :fields='fields'
        sticky-header='100%'
        head-variant='light'
        small
        hover
        sort-icon-left
        class='h-100 sticky-table'
        :items='timeSeriesData'>
      <template #cell(Targetword)='row'>
        <span :style='`color: ${row.item.Color}`'>{{ row.item.Targetword }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
import {roundToMaxDigit} from "@/helpers/utils";

export default {
  name: "TimeSeriesTable",
  props: ['options'],
  computed: {
    fields() {
      if (this.timeSeriesData.length <= 0) return [];
      let fields = [];
      for (let key in this.timeSeriesData[0]) {
        if (key !== 'Color')
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
            let ts = this.$store.getters['main/timeSeriesData'](p)
            let label = this.$store.getters['main/selectedTargetword'](p)?.text
            let color = p === 'pane1'? this.$store.getters['main/selectionColors'][0] : this.$store.getters['main/selectionColors'][1]
            let rows = []
            for (const key of Object.keys(ts)) {
              for (const [relationToKey, relationToValue] of Object.entries(ts[key])) {
                let rowList = relationToValue.map(v => {
                  let metricValue = roundToMaxDigit(v['value'], this.tableOptions.digits)
                  return {
                    'Targetword': label,
                    'Metric': key,
                    'Relative to': relationToKey,
                    'Year': v['year'],
                    'Value': metricValue,
                    'Color': color
                  }
                })
                rows = rows.concat(rowList)
              }
            }
            return rows
          })
          .flat()
    },
  }
}
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