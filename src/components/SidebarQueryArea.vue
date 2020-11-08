<template>
  <div class="row mt-2">
    <div class="col">
      <ActiveSearchItems/>
      <SearchForm/>
    </div>
  </div>
</template>

<script>

import ActiveSearchItems from '@/components/ActiveSearchItems';
import SearchForm from '@/components/SearchForm';

export default {
  name: 'SidebarQueryArea',
  components: {
    ActiveSearchItems, SearchForm
  },
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
  },
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
