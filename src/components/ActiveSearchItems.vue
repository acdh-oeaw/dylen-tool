<template>
  <div class="row">
    <div class="col">
      <b-list-group>
        Active Queries:
        <b-list-group-item v-for="item in egoNetworks" :key="item.id" variant="success">
          {{item.text}} / {{item.corpus}} / {{item.source}}
          <b-icon v-on:click="removeItem(item.id)" icon="x-circle"></b-icon>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ActiveSearchItems',
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    removeItem(networkID) {
      this.$store.commit('removeEgoNetwork', networkID);
    }
  },
  computed: {
    egoNetworks: {
      get() {
        return this.$store.getters.egoNetworks;
      }
    },
  },
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
