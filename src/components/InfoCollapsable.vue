<template>
  <div class='accordion' role='tablist'>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-ego-1 variant="info">
          <slot name='definition'></slot>
        </b-button>
      </b-card-header>
      <b-collapse id="accordion-ego-1" visible accordion="ego-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text class='text-left'>
            <slot name='definition-content'></slot>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-ego-2 variant="info">
          <slot name='use-case-header'></slot>
        </b-button>
      </b-card-header>
      <b-collapse id="accordion-ego-2" accordion="ego-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text class='text-left'>
            <slot name='use-case-content'></slot>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-ego-3 variant="info">
          <slot name='guide-header'></slot>
        </b-button>
      </b-card-header>
      <b-collapse id="accordion-ego-3" accordion="ego-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text class='text-left'>
            <slot name='guide-content'></slot>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class='mb-1'>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-ego-4 variant="info"><slot name='details-header'></slot></b-button>
      </b-card-header>
      <b-collapse id="accordion-ego-4" accordion="ego-accordion" role="tabpanel">
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
  name: "InfoCollapsable"
}
</script>

<style scoped>

</style>