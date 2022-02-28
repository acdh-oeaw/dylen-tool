<template>
  <div class='accordion' role='tablist'>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle='getCollapsableId(1)' variant="info" data-sauto-id='info-collapsable-button'>
          <slot name='definition'></slot>
        </b-button>
      </b-card-header>
      <b-collapse :id="getCollapsableId(1)" visible :accordion="getAccordionName()" role="tabpanel">
        <b-card-body>
          <b-card-text class='text-left'>
            <slot name='definition-content'></slot>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle='getCollapsableId(2)' variant="info" data-sauto-id='info-collapsable-button'>
          <slot name='use-case-header'></slot>
        </b-button>
      </b-card-header>
      <b-collapse :id="getCollapsableId(2)" :accordion="getAccordionName()" role="tabpanel">
        <b-card-body>
          <b-card-text class='text-left'>
            <slot name='use-case-content'></slot>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle='getCollapsableId(3)' variant="info" data-sauto-id='info-collapsable-button'>
          <slot name='guide-header'></slot>
        </b-button>
      </b-card-header>
      <b-collapse :id="getCollapsableId(3)" :accordion="getAccordionName()" role="tabpanel">
        <b-card-body>
          <b-card-text class='text-left'>
            <slot name='guide-content'></slot>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle='getCollapsableId(4)' variant="info" data-sauto-id='info-collapsable-button'><slot name='details-header'></slot></b-button>
      </b-card-header>
      <b-collapse :id="getCollapsableId(4)" :accordion="getAccordionName()" role="tabpanel">
        <b-card-body>
          <b-card-text class='text-left'>
            <slot name='details-content'></slot>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "InfoCollapsable",
  props: ['name'],
  methods: {
    getCollapsableId(collapsId) {
      return 'accordion-' + this.name + '-' + collapsId
    },
    getAccordionName() {
      return this.name + '-accordion'
    }
  }
}
</script>

<style scoped>

</style>
