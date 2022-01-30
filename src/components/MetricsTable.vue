<template>
  <div
    ref='table'
    style="height: 85%;"
  >
    <b-table
      :items='tableData'
      :fields='fields'
      :responsive='true'
      :sort-by="'word'"
      :sort-compare='sortCompare'
      :filter="filter"
      :filter-function='customFilter'
      :filter-included-fields="filterOn"
      sticky-header='100%'
      head-variant='light'
      small
      hover
      sort-icon-left
      class='h-100 sticky-table'
      data-sauto-id='table'
      @sort-changed='handleSortChanged'
    >
      <template #head(selected)="">
        <div style='width:3em'>
          <b-button
            style='padding:0'
            variant='none'
            @click=' (event) => selectionCheckboxChanged(event)'
          >
            <b-icon :icon="isAllSelected ? 'check-square' : 'square'"></b-icon>
          </b-button>
          <b-button
            style='padding:0'
            variant='none'
            @click='(event) => filterClicked(event, "selected","filterSelected")'
          >
            <b-icon
              v-if='filterOn.indexOf("selected") < 0'
              :icon="'filter-circle'"
            ></b-icon>
            <b-icon
              v-if='filterOn.indexOf("selected") >= 0'
              :icon="'filter-circle-fill'"
            ></b-icon>
          </b-button>
        </div>
      </template>
      <template #head(word)="">
        <div style='width:7em'>
          <span>Word </span>
          <span>
            <b-button
              id='word-filter-input'
              style='padding:0'
              variant='none'
              @click='(event) => filterClicked(event, "word","filterWord")'
            >
              <b-icon
                v-if='filterOn.indexOf("word") < 0'
                :icon="'filter-circle'"
              ></b-icon>
              <b-icon
                v-if='filterOn.indexOf("word") >= 0'
                :icon="'filter-circle-fill'"
              ></b-icon>
            </b-button>
            <b-popover
              target='word-filter-input'
              title="Word filter"
              triggers="click blur"
            >
              <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    id="filter-input"
                    v-model="filterWord"
                    type="search"
                    placeholder="Type to Filter"
                    @keypress='e => keyPress(e,"node-metrics-filter")'
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
            </b-popover>
          </span>

        </div>
      </template>
      <template #head(network)="">
        <div style='width:7em'>
          <span>Network </span>
          <b-button
            id='network-filter-input'
            style='padding:0'
            variant='none'
            @click='(event) => filterClicked(event, "network","filterNetwork")'
          >
            <b-icon
              v-if='filterOn.indexOf("network") < 0'
              :icon="'filter-circle'"
            ></b-icon>
            <b-icon
              v-if='filterOn.indexOf("network") >= 0'
              :icon="'filter-circle-fill'"
            ></b-icon>
          </b-button>
          <b-popover
            target='network-filter-input'
            title='Network filter'
            triggers='click blur'
          >
            <b-form-group
              label="Filter"
              label-for="filter-input"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filter-input"
                  v-model="filterNetwork"
                  type="search"
                  placeholder="Type to Filter"
                  @keypress='e => keyPress(e,"node-metrics-filter")'
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-popover>
        </div>
      </template>
      <template #cell(selected)='row'>
        <div data-sauto-id='ignore'>
          <b-button
            variant='none'
            class='mx-auto'
            @click=' (event) => addOrRemoveSelectedNodeAndHandleClick(event, row.item.node)'
          >
            <b-icon :icon="row.item.selected ? 'check-square' : 'square'"></b-icon>
          </b-button>
        </div>
      </template>
      <template #cell(word)='row'>
        <span>{{ row.item.word }}</span>
      </template>
      <template #cell(network)='row'>
        <span :style='`color: ${row.item.color}`'>{{ row.item.network }}</span>
      </template>
    </b-table>
  </div>
</template>
<script>
import { roundToMaxDigit } from '@/helpers/utils';
const logger = require('../helpers/logger');
export default {
  name: 'MetricsTable',
  props: ['selectedNodes', 'allNodes', 'options'],
  data() {
    return {
      filterSelected: null,
      filterWord: null,
      filterNetwork: null,
      filterOn: [],
      sortDirection: 'asc'
    };
  },
  computed: {
    filter: function () {
      if (
        this.filterSelected === null &&
        this.filterWord === null &&
        this.filterNetwork === null
      ) {
        return null;
      }

      return [this.filterSelected, this.filterWord, this.filterNetwork];
    },
    tableOptions() {
      return this.$store.getters['main/tableOptions'];
    },
    tableData() {
      return this.allNodes.map((node) => {
        let networkEntry =
          this.$store.getters['main/getPane'](node._pane).selectedNetwork
            .type === 'Ego'
            ? this.$store.getters['main/selectedTargetword'](node._pane).text
            : this.$store.getters['main/getPane'](node._pane).selectedNetwork
                .type === 'Party'
            ? this.$store.getters['main/getPane'](node._pane).selectedNetwork
                .party
            : this.$store.getters['main/getPane'](node._pane).selectedNetwork
                .type === 'Speaker'
            ? this.$store.getters['main/getPane'](node._pane).selectedNetwork
                .speaker
            : null;

        let tableEntry = {
          selected: Boolean(this.checkSelected(node)),
          word: node.name,
          network: `${networkEntry}, ${
            this.$store.getters['main/getPane'](node._pane).selectedNetwork.year
          }`,
          color: this.getLineColor(node),
          node: node
        };
        let maxDigits = this.tableOptions.digits;
        /* logger.log(node);
        tableEntry['normalizedFrequency'] =
          node._normalisedFrequency?.toExponential(2); */
        for (let key in node._metrics)
          tableEntry[key] = roundToMaxDigit(node._metrics[key], maxDigits);

        return tableEntry;
      });
    },
    fields() {
      if (this.tableData.length <= 0) return [];
      let fields = [];
      for (let key in this.tableData[0]) {
        if (key !== 'color' && key !== 'node')
          fields.push({
            key,
            sortable: true
          });
      }
      return fields;
    },
    isAllSelected: {
      get: function () {
        let selectedSize = this.tableData.filter((entry) =>
          this.$store.getters['main/selectedNodesForMetrics'].find(
            (n) => n.id === entry.node.id && n._pane === entry.node._pane
          )
        ).length;
        let allSize = this.tableData.length;
        return selectedSize === allSize;
      },
      set: function () {}
    }
  },
  methods: {
    getLineColor(node) {
      if (node._pane === 'pane1')
        return this.$store.getters['main/selectionColors'][0];
      if (node._pane === 'pane2')
        return this.$store.getters['main/selectionColors'][1];
      return 'black';
    },
    checkSelected(node) {
      return this.selectedNodes.find(
        (n) => n.id === node.id && n._pane === node._pane
      );
    },
    addOrRemoveSelectedNodeAndHandleClick(event, node) {
      let foundSelected = this.checkSelected(node);
      if (foundSelected) {
        this.$store.commit(
          'main/removeSelectedNodeForNodeMetrics',
          foundSelected
        );
      } else {
        this.$store.commit('main/addSelectedNodeForNodeMetrics', node);
      }

      this.mouseClick(event, 'table-item');
    },
    sortCompare(a, b, key, sortDesc) {
      if (this.tableOptions.selectedOnTop) {
        if (a.selected == b.selected)
          return a[key].localeCompare && +a != a
            ? a[key].localeCompare(b[key])
            : +a[key] - +b[key];
        if (a.selected) return sortDesc ? 1 : -1;
        if (b.selected) return sortDesc ? -1 : 1;
      } else {
        return a[key].localeCompare && +a != a
          ? a[key].localeCompare(b[key])
          : +a[key] - +b[key];
      }
    },
    handleSortChanged(value) {
      const event = this.calculateSliderPosition(value.sortBy);
      this.mouseClick(event, 'table-sort');
    },
    calculateSliderPosition(value) {
      //im sorry for this hacky workaround but table header doesnt register clicks (when sorting)
      const sizes = this.$refs.table.getBoundingClientRect();
      //x, y, width, height
      const clientY = sizes.y + 10;
      //indexes:   1 ---i-- array.length , where i is index of value
      //positions: 0 ---p-- width        , where p is position of i
      //and the rest is basic proportion calculation
      const arrayLength = this.fields.length;
      let i = 0;
      for (i = 0; i < this.fields.length; i++) {
        if (this.fields[i].key === value) {
          break;
        }
      }
      const clientX = ((i + 1) * sizes.width) / arrayLength + sizes.x;
      //this calculation works with an error margin of couple of pixels
      //to be honest im disgusted and proud of this method
      return {
        clientX,
        clientY
      };
    },
    selectionCheckboxChanged(event) {
      logger.log(this.tableData);
      if (this.isAllSelected) this.deselectAllNodes();
      else this.selectAllNodes();
      this.mouseClick(event, 'table-select-all');
    },
    customFilter(row, filter) {
      // logger.log('filtering on: ' + this.filterOn);
      // logger.log('filter row: ' + JSON.stringify(row));
      // logger.log('filter filter: ' + filter);

      const selectedCheck =
        filter[0] !== null ? row.selected === filter[0] : null;
      const wordCheck =
        filter[1] !== null
          ? row.word.toLowerCase().startsWith(filter[1].toLowerCase())
          : null;
      const networkCheck =
        filter[2] !== null
          ? row.network.toLowerCase().startsWith(filter[2].toLowerCase())
          : null;

      return (
        (selectedCheck || selectedCheck === null) &&
        (wordCheck || wordCheck === null) &&
        (networkCheck || networkCheck === null)
      );
    },
    filterClicked(event, column, filterName) {
      let i = this.filterOn.indexOf(column);
      if (i < 0) {
        this.filterOn.push(column);
        if (column === 'selected') this.filterSelected = true;
      } else {
        this.filterOn.splice(i, 1);
        this[filterName] = null;
      }
      this.mouseClick(event, 'node-metrics-filter');
      event.stopPropagation()
    },
    selectAllNodes() {
      this.tableData
        .filter(
          (entry) =>
            !this.$store.getters['main/selectedNodesForMetrics'].find(
              (n) => n.id === entry.node.id && n._pane === entry.node._pane
            )
        )
        .forEach((entry) => {
          this.$store.commit('main/addSelectedNodeForNodeMetrics', entry.node);
        });
    },
    deselectAllNodes() {
      this.tableData
        .filter((entry) =>
          this.$store.getters['main/selectedNodesForMetrics'].find(
            (n) => n.id === entry.node.id && n._pane === entry.node._pane
          )
        )
        .forEach((entry) => {
          this.$store.commit(
            'main/removeSelectedNodeForNodeMetrics',
            entry.node
          );
        });
    }
  }
};
</script>

<style>
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
