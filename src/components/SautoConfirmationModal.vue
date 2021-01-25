<template>
  <div>
    <b-modal v-model="modalShow" id="bv-modal-example" hide-footer>
      <template #modal-title>
        Master Thesis data
      </template>
      <div class="d-block text-center">
        <p>
          Your usage of this web application will be captured and used in a Master's Thesis.
          No information about your identity, device or location is saved.
          Please accept if you want to help the master's thesis.
        </p>
      </div>
      <div class="row justify-content-around">
        <b-button variant="danger" class="col-4 mt-3" block @click="agreeSauto(false)">Decline</b-button>
        <b-button variant="success" class="col-4 mt-3" block @click="agreeSauto(true)">Accept</b-button>
      </div>
    </b-modal>
  </div>

</template>

<script>
export default {
  name: 'SautoConfirmationModal',
  props: {},
  data() {
    return {
      modalShow: true
    }
  },
  mounted() {

  },
  methods: {
    agreeSauto(agreed) {
      this.$store.dispatch('sauto/agree', {agreed});
      this.modalShow = false;
    }
  },
  computed: {},
  watch: {},
}

</script>
<style scoped></style>