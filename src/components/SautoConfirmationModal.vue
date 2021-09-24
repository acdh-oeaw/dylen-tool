<template>
  <div>
    <b-modal
      header-class="modal-header-center"
      v-model="modalShow"
      id="bv-modal-example"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <template #modal-header> MASTER'S THESIS DATA </template>
      <div class="d-block">
        <p>
          In the scope of a Master's Thesis about usability and user
          friendliness, your usage of this web application will be captured.
          <b
            >NO information about your identity, device or location will be
            captured or saved.</b
          >
          Please accept, if you want to support the research for the Master's
          Thesis.
        </p>
      </div>
      <div class="row justify-content-around">
        <b-button
          variant="danger"
          class="col-4 mt-3"
          block
          @click="agreeSauto(false)"
        >
          Decline
        </b-button>
        <b-button
          variant="success"
          class="col-4 mt-3"
          block
          @click="agreeSauto(true)"
        >
          Accept
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import logger from '../helpers/logger';

export default {
  name: 'SautoConfirmationModal',
  props: {},
  data() {
    return {
      modalShow: true,
    };
  },
  mounted() {},
  methods: {
    agreeSauto(agreed) {
      logger.log('User agreed to Sauto: ' + agreed);
      this.$store.dispatch('sauto/agree', { agreed });
      this.modalShow = false;
    },
  },
  computed: {},
  watch: {},
};
</script>
<style scoped>
/deep/ .modal-header-center {
  display: flex;
  justify-content: center;
}
</style>
