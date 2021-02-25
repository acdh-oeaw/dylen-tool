<template>
  <div class="row mt-2">
    <div class="col">
      <SearchForm/>
    </div>
  </div>
</template>

<script>

import SearchForm from '@/components/SearchForm';

export default {
  name: 'SidebarQueryArea',
  components: {
    SearchForm
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
