<template>
  <b-row class='justify-content-center mt-3'>
    <b-col xl='6'>
      <p>
        DYLEN is a research project which aims to gain insights to the dynamics of the Austrian German lexicon in the
        last 20 years and to measure the semantic change of language.
      </p>
      <p>You can use the search panel above to display various information about target words from various copora and
        subcorpora in graph, chart and table form.</p>
      <div>There is one corpus available
        <ul>
          <li>Austrian Media Corpus (AMC):</li>
        </ul>
      </div>
      <p>You can read more about the project here: <a
          href='https://dylen.acdh.oeaw.ac.at'>https://dylen.acdh.oeaw.ac.at</a>.</p>
      <p>The following example displays the target word <b>Balkan</b> from the Krone newspaper in the years 1996 and
        2017 with some related words selected to compare their various metrics.</p>
      <b-row class='justify-content-center' aligh-h='center'>
        <b-card align='center' no-body>
          <b-tabs content-class='mt-3' card>
            <b-tab title="Ego Network" active>
              <img src='@/assets/ego_example.png'
                   width='800'
                   height='auto'/>

              <b-card-text align='left'>
                Network visualization of a selected target word provides information about its <b>semantic
                neighborhood</b> in a given time period.<br/>
                Nodes are represented by top-50 lexemes that, according to the semantic model in use, are semantically
                most relevant to a target word. <br/>
                For semantic modeling, we utilize a <b>distributional word embedding</b> model, namely a neural network
                based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. <br/>
                The model is trained on the chosen corpus and it produces a word-vector correspondence based on
                co-occurrence statistics. <b>Cosine similarity</b> is further applied to vector representations to
                determine the semantic similarity between pairs of words which is reflected in the strength of the
                connections between respective nodes.
              </b-card-text>
            </b-tab>
            <b-tab title="General Network">
              <b-card-text align='left'>
                Network visualization of a selected parliament speaker or party provides information about their
                discourse topics in a given time period.<br/>
                Nodes are represented by the <b>most frequent lexemes</b> that constitute the selected corpus of a
                speaker/party. <br/>
                The strength of the connections between respective nodes is determined by a semantic model in use. <br/>
                For semantic modeling, we utilize a <b>distributional word embedding</b> model, namely a neural network
                based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. The model is trained
                on the chosen corpus and it produces a word-vector correspondence based on co-occurrence statistics.
                <br/>
                <b>Cosine similarity</b> is further applied to vector representations to determine the semantic
                similarity between pairs of words.
              </b-card-text>
            </b-tab>
            <b-tab title="Node Metrics">
              <b-card-text align='left'>
                Each graph provides the <b>scores of network metrics</b> for selected nodes. <br/>
                We assume the values to be significant when comparing the scores for different nodes within one chosen
                metric.<br/>
                <br/>
                Network metrics used are as follows:
                <ul>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.degree_centrality.html#networkx.algorithms.centrality.degree_centrality'
                         target='_blank'>degree centrality</a>
                    </b> - is the total number of edges linked to a node.
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.betweenness_centrality.html#networkx.algorithms.centrality.betweenness_centrality'
                         target='_blank'>betweenness centrality</a> - is the number of the shortest paths that pass
                      through the node; it represents the degree to which nodes stand between each other.
                    </b>
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.load_centrality.html#networkx.algorithms.centrality.load_centrality'
                         target='_blank'>load centrality</a> - is a betweenness-like centrality measure that
                      differs in its definition (uses hypothetical flow process).
                    </b>
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.closeness_centrality.html#networkx.algorithms.centrality.closeness_centrality'
                         target='_blank'>closeness centrality"</a> - indicates how close a node is to all other
                      nodes in the network; nodes with a high closeness score have the shortest distances to all other
                      nodes, i.e. is the most central.
                    </b>
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.harmonic_centrality.html#networkx.algorithms.centrality.harmonic_centrality'
                         target='_blank'>harmonic centrality</a> - is a variant of closeness centrality; higher
                      values indicate higher centrality.
                    </b>
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.eigenvector_centrality.html#networkx.algorithms.centrality.eigenvector_centrality'
                         target='_blank'>eigenvector centrality</a> - the idea behind this measure is that a
                      high eigenvector centrality means that a node is connected to many nodes who themselves have high
                      scores.
                    </b>
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.link_analysis.pagerank_alg.pagerank.html#networkx.algorithms.link_analysis.pagerank_alg.pagerank'
                         target='_blank'>pagerank</a> - is a variant of eigenvector centrality; the underlying
                      assumption is that a node is only as important as the nodes that link to it.
                    </b>
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.cluster.clustering.html#networkx.algorithms.cluster.clustering'
                         target='_blank'>clustering coefficient</a> - is a measure of the degree to which nodes
                      in a graph tend to cluster together.
                    </b>
                  </li>
                </ul>
              </b-card-text>
            </b-tab>
            <b-tab title="Semantic Change"><p>I'm a disabled tab!</p></b-tab>
          </b-tabs>
        </b-card>
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
