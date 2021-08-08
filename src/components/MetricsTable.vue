<template>
  <b-table
    :items="tableData"
    :fields="fields"
    :responsive="true"
    :sort-by="'word'"
    sticky-header="100%"
    small
    class="h-100"
  >
    <template #cell(network)="row">
      <span :style="`color: ${row.item.color}`">{{row.item.network}}</span>
    </template>
  </b-table>
</template>
<script>
export default {
  name: 'MetricsTable',
  props: ['netNodes', 'options'],
  data() {
    return {};
  },
  computed: {
    tableData() {
      return this.netNodes.map((node) => {
        let tableEntry = {
          word: node.name,
          network: `${
            this.$store.getters['main/selectedTargetword'](node._pane).text
          }, ${this.$store.getters['main/selectedYear'](node._pane).year}`,
          color: this.getLineColor(node),
        };
        for (let key in node._metrics) tableEntry[key] = node._metrics[key];
        return tableEntry;
      });
    },
    fields() {
      if (this.tableData.length <= 0) return [];
      let fields = [];
      for (let key in this.tableData[0]) {
        if (key != 'color') fields.push({ key, sortable: true });
      }
      return fields;
    },
  },
  methods: {
    getLineColor(node) {
      if (node._pane == 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane == 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
  },
};
</script>

<style>
</style>