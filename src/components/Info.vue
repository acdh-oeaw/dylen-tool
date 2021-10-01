<template>
  <b-row class='justify-content-center mt-3' >
    <b-col xl='6'>
      <p>
        DYLEN is a research project which aims to gain insights to the dynamics of the Austrian German lexicon in the
        last 20 years and to measure the influence of politicians on language change.
      </p>
      <p>You can use the search panel above to display various information about target words from various copora and
        subcorpora in graph, chart and table form.</p>
      <div>There are two corpora available to choose from:
        <ul>
          <li>Austrian Media Corpus (AMC):</li>
          <li>The Corpus of Austrian Parliamentary Records (ParlAT)</li>
        </ul>
      </div>
      <p>You can read more about the project here: <a
        href='https://dylen.acdh.oeaw.ac.at'>https://dylen.acdh.oeaw.ac.at</a>.</p>
      <p>The following example displays the target word <b>Balkan</b> from the Krone newspaper in the years 1996 and
        2017 with some related words selected to compare their various metrics.</p>
      <b-row align-h='center'>
        <img src='@/assets/example-usage.png'
             height='400px'
             width='800px'
        />
      </b-row>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'Info',
  props: {},
  data() {
    return {};
  },
  mounted() {
  },
  methods: {},
  computed: {},
  watch: {}
};

</script>
<style scoped>
</style>
