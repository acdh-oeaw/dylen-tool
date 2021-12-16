<template>
  <b-row>
    <b-col>
      <b-button
          v-if='position === "nav"'
          data-sauto-id='settings-button'
          class='mr-2'
          @click='toggleSideBar(settingComponent)'
      >
        <b-icon icon='gear'></b-icon>
      </b-button>
      <b-button
          v-if='position === "result"'
          size='sm'
          data-sauto-id='settings-button'
          class='settings-button'
          variant="light"
          @click='toggleSideBar(settingComponent)'
      >
        <b-icon icon='gear' font-scale="1"></b-icon>
      </b-button>
    </b-col>
  </b-row>


</template>

<script>
export default {
  name: "Setting",
  props: ['settingComponent','position'],
  methods: {
    toggleSideBar(component) {
      this.$store.commit('main/changeActiveSettings', {component: component})
    },
  }
}
</script>

<style scoped>

.settings-button {
  margin-right: 2.5em;
  margin-bottom: 0.5em;
  z-index: 2;
  position: absolute;
  right: 0;
}
</style>