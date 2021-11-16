<template>
  <b-row class='justify-content-center mt-3'>
    <b-col xl='6'>
      <b-row class='justify-content-center' aligh-h='center'>
        <b-card align='center' no-body>
          <b-tabs content-class='mt-3' card>
            <b-tab title='General Information' active>
              <b-card-text align='left'>
                <p>
                  DYLEN is a research project which aims to gain insights to the dynamics of the Austrian German lexicon
                  in the
                  last 20 years and to measure the semantic change of language.
                </p>
                <p>You can use the search panel above to display various information about target words from various
                  copora and
                  subcorpora in graph, chart and table form.</p>
                <div>There is one corpus available
                  <ul>
                    <li>Austrian Media Corpus (AMC):</li>
                  </ul>
                </div>
                <p>
                  Austrian Media Corpus (AMC) consists of multiple subcorpora.<br>
                  Some of the subcorpora are combination of different media sources, which are listed below;
                  <ul>
                    <li>All magazines: </li>
                  </ul>
                </p>
                <p>You can read more about the project here: <a
                    href='https://dylen.acdh.oeaw.ac.at'>https://dylen.acdh.oeaw.ac.at</a>.</p>
                <p>You can click on the other tabs to get more information about different components of the
                  application</p>
              </b-card-text>
            </b-tab>
            <b-tab title='Ego Network'>
              <img src='@/assets/ego_example.png'
                   width='800'
                   height='auto'/>

              <b-card-text align='left'>
                Network visualization of a selected target word provides information about its <b>semantic
                neighborhood</b> in a given time period.<br>
                Nodes are represented by top-50 lexemes that, according to the semantic model in use, are semantically
                most relevant to a target word. <br>
                For semantic modeling, we utilize a <b>distributional word embedding</b> model, namely a neural network
                based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. <br>
                The model is trained on the chosen corpus and it produces a word-vector correspondence based on
                co-occurrence statistics. <b>Cosine similarity</b> is further applied to vector representations to
                determine the semantic similarity between pairs of words which is reflected in the strength of the
                connections between respective nodes.
              </b-card-text>
            </b-tab>
            <b-tab title='General Network'>
              <b-card-text align='left'>
                Network visualization of a selected parliament speaker or party provides information about their
                discourse topics in a given time period.<br>
                Nodes are represented by the <b>most frequent lexemes</b> that constitute the selected corpus of a
                speaker/party. <br>
                The strength of the connections between respective nodes is determined by a semantic model in use. <br>
                For semantic modeling, we utilize a <b>distributional word embedding</b> model, namely a neural network
                based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. The model is trained
                on the chosen corpus and it produces a word-vector correspondence based on co-occurrence statistics.
                <br>
                <b>Cosine similarity</b> is further applied to vector representations to determine the semantic
                similarity between pairs of words.
              </b-card-text>
            </b-tab>
            <b-tab title='Network Metrics'>
              <img src='@/assets/parallel_coordinates.png'
                   width='800'
                   height='auto'/>
              <b-card-text align='left'>
                Each of the ego networks can be described by different network metrics. <br>
                <a href='https://en.wikipedia.org/wiki/Parallel_coordinates' target='_blank'>Parallel coordinates</a> is
                used to visualise scores of different metrics for selected nodes, x-axis represents different network
                metrics, while the y-axis show the scores.<br>
                We assume the values to be significant when comparing the scores for different nodes within one chosen
                metric.<br>
                <br>
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
                         target='_blank'>betweenness centrality</a>
                    </b> - is the number of the shortest paths that pass
                    through the node; it represents the degree to which nodes stand between each other.
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.load_centrality.html#networkx.algorithms.centrality.load_centrality'
                         target='_blank'>load centrality</a>
                    </b> - is a betweenness-like centrality measure that
                    differs in its definition (uses hypothetical flow process).
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.closeness_centrality.html#networkx.algorithms.centrality.closeness_centrality'
                         target='_blank'>closeness centrality</a>
                    </b> - indicates how close a node is to all other
                    nodes in the network; nodes with a high closeness score have the shortest distances to all other
                    nodes, i.e. is the most central.
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.harmonic_centrality.html#networkx.algorithms.centrality.harmonic_centrality'
                         target='_blank'>harmonic centrality</a>
                    </b> - is a variant of closeness centrality; higher
                    values indicate higher centrality.
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.eigenvector_centrality.html#networkx.algorithms.centrality.eigenvector_centrality'
                         target='_blank'>eigenvector centrality</a>
                    </b> - the idea behind this measure is that a
                    high eigenvector centrality means that a node is connected to many nodes who themselves have high
                    scores.
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.link_analysis.pagerank_alg.pagerank.html#networkx.algorithms.link_analysis.pagerank_alg.pagerank'
                         target='_blank'>pagerank</a>
                    </b> - is a variant of eigenvector centrality; the underlying
                    assumption is that a node is only as important as the nodes that link to it.
                  </li>
                  <li>
                    <b>
                      <a href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.cluster.clustering.html#networkx.algorithms.cluster.clustering'
                         target='_blank'>clustering coefficient</a>
                    </b> - is a measure of the degree to which nodes
                    in a graph tend to cluster together.
                  </li>
                </ul>
              </b-card-text>
            </b-tab>
            <b-tab title='Time Series Analysis'>
              <b-card-text align='left'>
                <p><b>Time series analysis</b> allows us to track the change over time. <br>
                  Each graph indicates the diachronic development of a given target word according to the frequency
                  change
                  or to one of the similarity measures (all measures are introduced later).<br>
                </p>
                <p>
                  Each measure provides a single score by comparing data from two time periods, and thus produces three
                  time series graphs depending on which time periods and in what order are compared. <br>
                  The first perspective is to compare each subsequent year to the previous one, second - each subsequent
                  year to the first year,
                  and third - each subsequent year to the last year. <br>
                  Only the similarity score based on network embeddings
                  doesn't follow the procedure described above. Instead of providing point-wise comparison, this measure
                  adopts a cumulative strategy. The idea behind the cumulative approach is that semantic similarity is
                  defined not by a single previous year, but by all previous time periods.
                </p>
                <p>
                  All similarity scores are based on the network representation of a target word in different time
                  periods. Some of the measures make use only of network nodes lists (not the network itself), however
                  the
                  set of nodes is also influenced by the network structure. To interpret similarity measures one can
                  assume that a high value suggests that the context of a word has not changed much, while a low value
                  implies that the meaning of a word might have changed from one time point to another. Only Frobenius
                  similarity differs in interpretation of its scores: high values indicate the most changed network
                  structure of a word in corresponding time periods.
                </p>
                <ul>
                  <li>
                    <b>Frequency difference:</b> the measure shows the absolute difference of normalized frequency
                    values in two years.
                  </li>
                  <li>
                    <b>Jaccard similarity:</b> Jaccard index [4] is applied to measure the similarity between node sets
                    of target word networks in two years. It is defined as the size of the intersection divided by the
                    size of the union of the given sets. The score ranges from 0 to 1.
                  </li>
                  <li>
                    <b>RankDCG similarity:</b> Rank discounted cumulative gain score is also applied to measure the
                    similarity
                    between node sets of target word networks in two years. However, unlike Jaccard similarity, it takes
                    into account semantic closeness of nodes to a target word, and it represents an improved version of
                    the normalized discounted cumulative gain metric described in [5]. The score ranges from 0 to 1.
                  </li>
                  <li>
                    <b>Local neighborhood similarity:</b> this measure is often used for semantic change detection, it
                    was
                    introduced by [3]. Two second-order vectors are created corresponding to two time periods. Their
                    length equals the size of nodes union, and cosine similarities between a target word and each node
                    provide scores of the vectors. Then, cosine similarity is computed between these vectors. The score
                    ranges from 0 to 1.
                  </li>
                  <li>
                    <b>Frobenius similarity:</b> this measure is computed by taking the Frobenius norm [1] of a matrix
                    obtained
                    as a difference between adjacency matrices of target word networks in two years. Adjacency matrices
                    are pre-processed to represent the union of nodes of two time slices. The score doesn't have a fixed
                    range.
                  </li>
                  <li>
                    <b>Network embeddings similarity:</b> this measure requires incremental training of node embedding models
                    of networks of subsequent years. Node embeddings are obtained by the node2vec algorithm described in
                    [2]. The score between two years is computed by averaging node embeddings to represent a network and
                    taking cosine similarity between obtained network vectors. The score ranges from 0 to 1.
                  </li>
                </ul>
              </b-card-text>
              <img src='@/assets/timeseries.png'
                   width='800'
                   height='auto'/>
            </b-tab>
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
