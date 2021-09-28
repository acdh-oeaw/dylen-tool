<template>
  <b-table
    :items='tableData'
    :fields='fields'
    :responsive='true'
    :sort-by="'word'"
    :sort-compare='sortCompare'
    sticky-header='100%'
    small
    sort-icon-left
    class='h-100'
  >

    <template #cell(selected)='row'>
      <b-button
        variant='none'
        class='mx-auto'
        @click=' () => addOrRemoveSelectedNode(row.item.node)'
      >
        <b-icon :icon="row.item.selected ? 'check-square' : 'square'"></b-icon>
      </b-button>
    </template>
    <template #cell(word)='row'>
      <span>{{ row.item.word }}</span>
    </template>
    <template #cell(network)='row'>
      <span :style='`color: ${row.item.color}`'>{{ row.item.network }}</span>
    </template>
  </b-table>
</template>
<script>
export default {
  name: 'MetricsTable',
  props: ['selectedNodes', 'allNodes', 'options'],
  data() {
    return {};
  },
  computed: {
    tableOptions() {
      return this.$store.getters['main/tableOptions'];
    },
    tableData() {
      return this.allNodes.map((node) => {
        let tableEntry = {
          selected: Boolean(this.checkSelected(node)),
          word: node.name,
          network: `${
            this.$store.getters['main/selectedTargetword'](node._pane).text
          }, ${
            this.$store.getters['main/getPane'](node._pane).selectedNetwork.year
          }`,
          color: this.getLineColor(node),
          node: node
        };
        let maxDigits = this.tableOptions.digits;
        for (let key in node._metrics)
          tableEntry[key] =
            maxDigits > 10
              ? node._metrics[key]
              : Math.round(
              (node._metrics[key] + Number.EPSILON) *
              Math.pow(10, maxDigits)
            ) / Math.pow(10, maxDigits);
        return tableEntry;
      });
    },
    fields() {
      if (this.tableData.length <= 0) return [];
      let fields = [];
      for (let key in this.tableData[0]) {
        if (key != 'color' && key != 'node')
          fields.push({ key, sortable: true });
      }
      return fields;
    }
  },
  methods: {
    getLineColor(node) {
      if (node._pane == 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane == 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
    checkSelected(node) {
      return this.selectedNodes.find(
        (n) => n.id == node.id && n._pane == node._pane
      );
    },
    addOrRemoveSelectedNode(node) {
      let foundSelected = this.checkSelected(node);
      if (foundSelected) {
        this.$store.commit(
          'main/removeSelectedNodeForNodeMetrics',
          foundSelected
        );
      } else {
        this.$store.commit('main/addSelectedNodeForNodeMetrics', node);
      }
    },
    sortCompare(a, b, key, sortDesc) {
      if (this.tableOptions.selectedOnTop) {
        if (a.selected == b.selected)
          return a[key].localeCompare
            ? a[key].localeCompare(b[key])
            : a[key] - b[key];
        if (a.selected) return sortDesc ? 1 : -1;
        if (b.selected) return sortDesc ? -1 : 1;
      } else {
        return a[key].localeCompare
          ? a[key].localeCompare(b[key])
          : a[key] - b[key];
      }
    }
  }
};
</script>

<style></style>
