<template>
  <div class="row">
    <div class="col">
      <b-list-group>
        Active Queries:
        <b-list-group-item
            v-for="(item,i) in egoNetworks"
            :key="item.id+i"
            variant="success"
            :data-sauto-id="'activeSearch-'+item.corpus+item.subcorpus+item.text+item.year+'-'+i">
          {{ item.corpus }} / {{ item.subcorpus }} / {{ item.text }} / {{ item.year }}
          <b-icon
              v-on:click="removeItem(item.id)"
              icon="x-circle"
              :data-sauto-id="'activeSearch-remove-'+item.corpus+item.subcorpus+item.text+item.year+'-'+i">
          </b-icon>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ActiveSearchItems',
  props: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    removeItem(networkID) {
      this.$store.commit('main/removeEgoNetwork', networkID);
    }
  },
  computed: {
    egoNetworks: {
      get() {
        return this.$store.getters["main/egoNetworks"];
      }
    },
  },
  watch: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
