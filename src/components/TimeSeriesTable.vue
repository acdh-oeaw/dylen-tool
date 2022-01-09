<template>
  <div
      ref='table'
      style="height: 85%;"
  >
    <b-table
        :responsive='true'
        :sort-by="'Word'"
        sticky-header='100%'
        head-variant='light'
        small
        hover
        sort-icon-left
        class='h-100 sticky-table'
        :items='timeSeriesData'></b-table>
  </div>
</template>

<script>
export default {
  name: "TimeSeriesTable",
  props: ['options'],
  computed: {
    timeSeriesData() {
      let timeSeries =  ['pane1', 'pane2']
          .map((p) => {
            let ts = this.$store.getters['main/timeSeriesData'](p)
            let label = this.$store.getters['main/selectedTargetword'](p)?.text
            let rows = []
            for (const [key, value] of Object.entries(ts)) {
              console.log(`${key}: ${value}`);
              for (const [relationToKey, relationToValue] of Object.entries(ts[key])) {
                console.log(`${relationToKey}: ${relationToValue}`);
                let rowList = relationToValue.map(v => {
                  let row = {
                    'Word': label,
                    'Metric': key,
                    'Relative to': relationToKey,
                    'Year': v['year'],
                    'Value': v['value']
                  }
                  return row
                })
                rows = rows.concat(rowList)
              }
            }
            return rows
          })
          .flat()

      return timeSeries
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