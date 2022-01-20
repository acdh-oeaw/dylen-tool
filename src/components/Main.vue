<template>
  <b-row
      xl='12'
      class='pl-3 pt-0 h-100'
  >
    <b-col
        xl='2'
        class='pt-0 mt-0'
        style='border-right: solid; border-color: cadetblue'
    >
      <query-bar></query-bar>
    </b-col>
    <b-col
        class='h-100'
        xl='10'
    >
      <div
          class='h-100 pr-4'
          data-sauto-id='results'
      >
        <results />
      </div>
      <div
          class='h-100 w-100 infoContainer'
          data-sauto-id='info'
          v-if='this.$store.state.main.showInfo'
      >
        <info />
      </div>
    </b-col>
  </b-row>
</template>

<script>
import Results from '@/components/Results';
import Info from '@/components/Info';
import QueryBar from '@/components/QueryBar';

export default {
  components: {
    Results, Info, QueryBar
  },
  name: "Main.vue"
}
</script>

<style scoped>

</style>