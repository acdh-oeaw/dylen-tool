<template>
  <!--  <b-row> -->
  <b-col>
    <b-button
      v-if='position === "nav"'
      data-sauto-id='settings-button-nav'
      class='mr-2'
      variant='info'
      @click='toggleSideBar(settingComponent)'
    >
      <b-icon icon='gear'></b-icon>
    </b-button>
    <b-button
      v-if='position === "result"'
      size='sm'
      data-sauto-id='settings-button-result'
      class='settings-button'
      variant="light"
      @click='toggleSideBar(settingComponent)'
    >
      <b-icon
        icon='gear'
        font-scale="1"
      ></b-icon>
    </b-button>
  </b-col>
  <!-- </b-row> -->

</template>

<script>
export default {
  name: 'Setting',
  props: ['settingComponent', 'position'],
  methods: {
    toggleSideBar(component) {
      this.$store.commit('main/changeActiveSettings', { component: component });
    }
  }
};
</script>

<style scoped>
</style>
