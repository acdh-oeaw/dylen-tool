<template>
  <b-row
      xl='12'
      class='justify-content-center mt-3'>
    <b-col xl='10'>
      <b-row
          xl='12'
          class='justify-content-center'
          aligh-h='center'
      >
        <b-col
            xl='12'>
          <b-card
              align='center'
              no-body
          >
            <b-tabs
                content-class='mt-3'
                card
            >
              <b-tab
                  class='info-tab py-0'
                  title='Start'
                  active
                  @click='onTabClick'
                  style='overflow: hidden'
              >
                <b-row class='justify-content-md-center pt-0 mb-0'>
                  <b-col lg='10' style='height: 100%'>
                    <b-card-header>
                      <h4>Welcome to DYLEN! Take a look at our tool's features</h4>
                    </b-card-header>
                    <b-card-body
                        class='py-0 my-0'
                        style='max-height:100%;'
                    >
                      <b-carousel
                          id="carousel-1"
                          class='mt-1'
                          :interval="0"
                          :controls='true'
                          :indicators='true'
                          background="#ababab"
                          style="text-shadow: 1px 1px 2px #333;"
                      >
                        <div style='color: black;'>
                          <b-carousel-slide
                              caption="Ego Network"
                              text="Explore semantic neighborhood of a target word in a given time period"
                              :img-src="require('../assets/info/ego.png')"
                          ></b-carousel-slide>
                          <b-carousel-slide
                              caption="General Network - Party"
                              text="Explore most frequent lexemes used by political parties"
                              :img-src="require('../assets/info/general.png')"
                          ></b-carousel-slide>
                          <b-carousel-slide
                              caption="General Network - Politicians"
                              text="Explore most frequent lexemes used by politicians"
                              :img-src="require('../assets/info/speaker.png')"
                          ></b-carousel-slide>
                          <b-carousel-slide
                              caption="Node Metrics"
                              text="Visualize nodes based on their node metrics with Parallel Coordinates"
                              :img-src="require('../assets/info/parallel.png')"
                          ></b-carousel-slide>
                          <b-carousel-slide
                              caption="Times series"
                              text="Track changes of network over time"
                              :img-src="require('../assets/info/timeseries.png')"
                          ></b-carousel-slide>
                        </div>
                      </b-carousel>
                    </b-card-body>
                  </b-col>
                </b-row>

              </b-tab>
              <b-tab
                  title='About'
                  @click='onTabClick'
                  data-sauto-id='info-tab-content'>
                <b-row class='justify-content-md-center'>
                  <b-col lg='10' style='height: 100%'>
                    <b-card-text>
                      <div class='accordion' role='tablist'>
                        <b-card no-body class='mb-1'>
                          <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-1 variant="info">About DYLEN</b-button>
                          </b-card-header>
                          <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                              <b-card-text class='text-left'>
                                <p>
                                  <b>DYLEN</b> Tool is an <b>interactive visualization tool</b>, which aims to help
                                  users to gain insights to the dynamics of the Austrian German lexicon
                                  in the last 20 years and to measure the semantic change of language, based on two
                                  different corpora, the <b>Austrian Media Corpus (AMC)</b> and the <b>Corpus of
                                  Austrian Parliamentary Records (ParlAT)</b>
                                </p>
                                <p>
                                <h5>How to use DYLEN</h5>
                                DYLEN provides visualizations of three different network types.<br>
                                <ul>
                                  <li><b>Ego Network:</b> This network type provides insights about semantic
                                    neighborhood of a target word in a given time period.
                                  </li>
                                  <li><b>General Network - Party:</b> Analysis the network of most frequent lexemes of a
                                    political party
                                  </li>
                                  <li><b>General Network - Politicians:</b> Analysis the network of most frequent
                                    lexemes of a politicians
                                  </li>
                                </ul>
                                <p>
                                  You can <b>select the network type</b> you want to explore on the top of the
                                  application.
                                </p>
                                <p>
                                  Click on the corresponding tabs for more information of each network types and
                                  different visualizations.<br>
                                </p>
                                <p>
                                  You can read more about the project here: <a href='https://dylen.acdh.oeaw.ac.at'>https://dylen.acdh.oeaw.ac.at</a>.<br>
                                </p>
                                Codes are available on following Github repositories:
                                <ul>
                                  <li>Frontend: <a href='https://github.com/acdh-oeaw/dylen-tool'>https://github.com/acdh-oeaw/dylen-tool</a>
                                  </li>
                                  <li>Backend: <a href='https://github.com/acdh-oeaw/dylen-backend'>https://github.com/acdh-oeaw/dylen-backend</a>
                                  </li>
                                </ul>
                              </b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                        <b-card no-body class="mb-1">
                          <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-2 variant="info">About Corpora/Data</b-button>
                          </b-card-header>
                          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                              <b-card-text class='text-left'>
                                <p>
                                  Two Corpora were used to generate linguistic network data:</p>
                                <ul>
                                  <li><b>Austrian Media Corpus (AMC)</b></li>
                                  <li><b>Corpus of Austrian Parliamentary Records (ParlAT)</b></li>
                                </ul>
                                <h5>Austrian Media Corpus</h5>
                                Austrian Media Corpus (AMC) covers the entire Austrian media landscape of the past 20
                                years
                                and contains 40 million texts (more than 10 billion tokens).<br>
                                For DYLEN, AMC corpus was divided into multiple subcorpora, which are collection of
                                articles
                                from different Austrian newspapers and magazines in the years between 1996 and 2017<br>
                                Some of the subcorpora are combination of different media sources, which are listed
                                below;
                                <ul>
                                  <li>All magazines</li>
                                  <li>All newspapers</li>
                                  <li>All magazines and newspapers</li>
                                </ul>
                                Following newspapers and magazines are available for visualizations.
                                <ul>
                                  <li>Falter</li>
                                  <li>Kleine Zeitung</li>
                                  <li>Kurier</li>
                                  <li>Die Presse</li>
                                  <li>Profil</li>
                                  <li>Der Standard</li>
                                </ul>
                                <h5>Corpus of Austrian Parliamentary Records (ParlAT)</h5>
                                The ParlAT corpus covers the Austrian parliamentary records of the last 20 years with
                                more than 75 million tokens.
                              </b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-col>
                </b-row>

              </b-tab>
              <b-tab
                  title='Ego Network'
                  @click='onTabClick'
                  data-sauto-id='info-tab-content'
              >
                <b-row class='justify-content-md-center'>
                  <b-col lg='10' style='height: 100%'>
                    <info-collapsable name='ego-network'>
                      <span slot='definition'>What is an Ego Network?</span>
                      <span slot='definition-content'>
                        <p>Ego-network visualization of a selected target word provides information about its <b>semantic
                        neighborhood</b> in a given time period.<br>
                        Nodes are represented by <b>top-50 lexemes</b> that, according to the semantic model in use, are <b>semantically
                        most relevant to a target word.</b> <br></p>
                      </span>
                      <span slot='use-case-header'>
                        Use Ego Network to answer..
                      </span>
                      <span slot='use-case-content'>
                      </span>
                      <span slot='guide-header'>
                        How to interpret the visuliation
                      </span>
                      <span slot='guide-content'>
                        <h5>How to use ego-network</h5>
                        <ol>
                          <li>
                            Select <code>Ego Network</code> on the Top Navigation bar.
                          </li>
                          <li>
                            Select a corpus dropdown selector. <br>
                          </li>
                          <li>
                            Select a subcorpus from the subcorpus dropdown selector
                          </li>
                          <li>
                            Type a target word into the input field and select one of the autocomplete suggestions
                          </li>
                          <li>Click on <code>Visualize</code></li>
                        </ol>
                        <h5>Ego-network interpretation guideline</h5>
                        <ul>
                          <li>The targetword isn't shown in the visualised ego-network, since every node have a connection to
                            the targetword and the network visualisation would be too unnecessarily complex.
                          </li>
                          <li>The <b>size of nodes</b> represents word frequency</li>
                          <li>The <b>thickness of edges</b> represents the similarity of nodes</li>
                          <li>The <b>colors of the labels</b> represent different Part-of-speech tags</li>
                          <li>The <b>colors of the nodes</b> represent different clusters. Cluster visualization is disabled by default, it can be enbaled by clicking on the checkbox <code>"show clusters"</code></li>
                        </ul>
                      </span>
                      <span slot='details-header'>Technical details</span>
                      <span slot='details-content'>
                        <p>
                          For semantic modeling, we utilize a <b>distributional word embedding</b> model, namely a neural network
                          based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. <br>
                        </p>
                        <p>
                          The model is trained on the chosen corpus and it produces a word-vector correspondence based on
                          co-occurrence statistics. <b>Cosine similarity</b> is further applied to vector representations to
                          determine the semantic similarity between pairs of words which is reflected in the strength of the
                          connections between respective nodes.
                        </p>
                        <p>
                          For semantic modeling, we utilize a <b>distributional word
                          embedding</b> model, namely a neural network
                          based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. <br>
                          The model is trained on the chosen corpus and it produces a word-vector correspondence based on
                          co-occurrence statistics. <b>Cosine similarity</b> is further applied to vector representations to
                          determine the semantic similarity between pairs of words which is reflected in the strength of the
                          connections between respective nodes.<br><br>
                        </p>

                      </span>
                    </info-collapsable>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab
                  title='General Network'
                  @click='onTabClick'
                  data-sauto-id='info-tab-content'
              >
                <b-row class='justify-content-md-center'>
                  <b-col lg='10' style='height: 100%'>
                    <info-collapsable name='general-network'>
                      <span slot='definition'>
                        What is a General Network?
                      </span>
                      <span slot='definition-content'>
                        Network visualization of a selected parliament speaker or party provides information about their
                        discourse topics in a given time period.<br>
                        Nodes are represented by the <b>most frequent lexemes</b> that constitute the selected corpus of a
                        speaker/party. <br>
                      </span>
                      <span slot='use-case-header'>
                        Use general network to answer..
                      </span>
                      <span slot='use-case-content'></span>
                      <span slot='guide-header'>How to use general network</span>
                      <span slot='guide-content'>
                        <ol>
                          <li>
                            Select <code>General Network (Party)</code> or <code>General Network (Speaker)</code> on the Top Navigation bar.
                          </li>
                          <li>
                            Select a party from the drop down selector. <br>
                            (Only for <code>General Network (Speaker)</code>)
                            Select a speaker from the drop down selector
                          </li>
                          <li>
                            (Optional) Select a <code>node filter metric</code> you want to use to filter the nodes from the dropdown selector <br>
                            General networks are very large in size, and visualizing the network is computationally expensive.<br>
                            Node metric filter is used to select only specific number of nodes based on the selected metrics,
                            <code>degree centrality</code> is the default selection
                          </li>
                          <li>
                            (Optional) Adjust the <code>node filter</code>. Too large span might cause long waiting time or even might freeze the browser.
                          </li>
                          <li>Click on <code>Visualize</code></li>
                        </ol>
                          <h5>How to interpret the visualization</h5>
                            <ul>
                              <li>The <b>size of nodes</b> represents word frequency</li>
                              <li>The <b>thickness of edges</b> represents the similarity of nodes</li>
                              <li>The <b>colors of the labels</b> represent different Part-of-speech tags</li>
                            </ul>
                      </span>
                      <span slot='details-header'>Technical details</span>
                      <span slot='details-content'>
                        The strength of the connections between respective nodes is determined by a semantic model in use. <br>
                        For semantic modeling, we utilize a <b>distributional word embedding</b> model, namely a neural network
                        based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. The model is trained
                        on the chosen corpus and it produces a word-vector correspondence based on co-occurrence statistics.
                        <br>
                        <b>Cosine similarity</b> is further applied to vector representations to determine the semantic
                        similarity between pairs of words.
                      </span>
                    </info-collapsable>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab
                  title='Node Metrics Comparison'
                  @click='onTabClick'
                  data-sauto-id='info-tab-content'
              >
                <b-row class='justify-content-md-center'>
                  <b-col lg='10' style='height: 100%'>
                    <info-collapsable name='node-metrics'>
                      <span slot='definition'>Description</span>
                      <span slot='definition-content'>
                        A network is a set of nodes and edges, and chracteristics of nodes and edges can be described with different metrics.<br>
                        The <code>Node Metrics Comparison</code> component helps users to compare different networks based on <b>10 different node metrics</b>.
                        <br>
                        Details of metrics used are described in the <b>Technical detail</b> section.
                      </span>
                      <span slot='use-case-header'>Use Node Metrics Comaprison for..</span>
                      <span slot='use-case-content'></span>
                      <span slot='guide-header'>How to use Node Metrics Comparison</span>
                      <span slot='guide-content'>
                        <h5><u>Parallel Coordinates</u></h5>
                        <p>
                          The DYLEN Parallel coordinates visualization is able to display node metrics of all nodes from two different networks.
                        </p>

                        <h6><b>Axes</b></h6>
                        <ul>
                          <li>
                            <code>x-axis</code> represents name of different node metrics, while the <code>y-axis</code> shows the metric values.
                          </li>
                          <li>
                            5 from 10 available node metrics are visualized as default, more metrics can be added by clicking on the <code>settings</code> icon <b-icon
                              icon='gear'></b-icon> and enabling the metrics from the <code>Axes to display</code> section. You can also change the order of the axes from settings
                          </li>
                        </ul>

                        <h6><b>Network Labels</b></h6>
                        <p>
                          The labels of the first and the second network are shown in the top left and top right position of the chart respectively.
                        </p>
                        <h6><b>Node Labels</b></h6>
                        <p>
                          The node labels are shown on the left and right side of the chart, overlapping words(words having the same/similar metric value on the first/last axis ) are displayed as <code>*</code>, the actual word can be viewed by hovering over the <code>*</code> character
                        </p>
                        <h6><b>Select/Deselect nodes</b></h6>
                        <p>
                          Sometimes the number of nodes can make interpretation of parallel coordinates difficult. <br>
                          You can use the <code>deselect all</code> button to remove all nodes and manually selecting the nodes to be shown
                          from the <code>Network visualization</code> or from the <code>Table view</code><br>
                          Individual nodes can be removed from the chart by clicking on the <code>'x'</code> icon, which appears when you hover over the node label.
                        </p>
                        <h6><b>Interactivity with Network Visualization</b></h6>
                        <p>
                          <code>Network visualization</code> and <code>Node metrics comparison</code> components share the same data. <br>
                          When you hover over the lines in the <code>Parallel coordinates</code>, corresponding node and its neighbors will be emphasized in the <code>Network visualization</code> and vice versa.
                        </p>
                      </span>
                      <span slot='details-header'>Technical details</span>
                      <span slot='details-content'>
                        <a
                            href='https://en.wikipedia.org/wiki/Parallel_coordinates'
                            target='_blank'>Parallel coordinates</a> is used to visualise scores of different metrics for selected nodes, x-axis represents different network
                        metrics, while the y-axis show the scores.<br>
                        We assume the values to be significant when comparing the scores for different nodes within one chosen
                        metric.<br>
                        <br>
                        Network metrics used are as follows:
                        <ul>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.degree_centrality.html#networkx.algorithms.centrality.degree_centrality'
                                  target='_blank'
                              >degree centrality</a>
                            </b> - is the total number of edges linked to a node.
                          </li>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.betweenness_centrality.html#networkx.algorithms.centrality.betweenness_centrality'
                                  target='_blank'
                              >betweenness centrality</a>
                            </b> - is the number of the shortest paths that pass
                            through the node; it represents the degree to which nodes stand between each other.
                          </li>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.load_centrality.html#networkx.algorithms.centrality.load_centrality'
                                  target='_blank'
                              >load centrality</a>
                            </b> - is a betweenness-like centrality measure that
                            differs in its definition (uses hypothetical flow process).
                          </li>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.closeness_centrality.html#networkx.algorithms.centrality.closeness_centrality'
                                  target='_blank'
                              >closeness centrality</a>
                            </b> - indicates how close a node is to all other
                            nodes in the network; nodes with a high closeness score have the shortest distances to all other
                            nodes, i.e. is the most central.
                          </li>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.harmonic_centrality.html#networkx.algorithms.centrality.harmonic_centrality'
                                  target='_blank'
                              >harmonic centrality</a>
                            </b> - is a variant of closeness centrality; higher
                            values indicate higher centrality.
                          </li>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.centrality.eigenvector_centrality.html#networkx.algorithms.centrality.eigenvector_centrality'
                                  target='_blank'
                              >eigenvector centrality</a>
                            </b> - the idea behind this measure is that a
                            high eigenvector centrality means that a node is connected to many nodes who themselves have high
                            scores.
                          </li>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.link_analysis.pagerank_alg.pagerank.html#networkx.algorithms.link_analysis.pagerank_alg.pagerank'
                                  target='_blank'
                              >pagerank</a>
                            </b> - is a variant of eigenvector centrality; the underlying
                            assumption is that a node is only as important as the nodes that link to it.
                          </li>
                          <li>
                            <b>
                              <a
                                  href='https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.cluster.clustering.html#networkx.algorithms.cluster.clustering'
                                  target='_blank'
                              >clustering coefficient</a>
                            </b> - is a measure of the degree to which nodes
                            in a graph tend to cluster together.
                          </li>
                        </ul>
                      </span>
                    </info-collapsable>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab
                  title='Time Series Analysis'
                  @click='onTabClick'
                  data-sauto-id='info-tab-content'
              >
                <b-row class='justify-content-md-center'>
                  <b-col lg='10' style='height: 100%'>
                    <info-collapsable name='timeseries'>
                      <span slot='definition'>Description</span>
                      <span slot='definition-content'>
                        <b>Time series analysis</b> allows us to track the change over time. <br>
                        Each graph indicates the diachronic development of a given target word according to the frequency
                        change or to one of the similarity measures. See <code>Technical details</code> section for detailed descriptions of each of the measures<br>
                      </span>
                      <span slot='use-case-header'>Use Time series analysis for..</span>
                      <span slot='use-case-content'></span>
                      <span slot='guide-header'>How to use Time series analysis</span>
                      <span slot='guide-content'>
                        <p>
                          The DYLEN Time series Analysis component visualizes the change of (absolute) difference in the values of selected metrics to a specific target year.
                        </p>
                        <ol>
                          <li>Select the metric you want to visualize from the <code>Metric dropdown selector</code></li>
                          <li>Select the year you want to compare the metrics to.</li>
                        </ol>

                        <h6>Axes</h6>
                        x-axis shows the years, while y-axis shows the value of the selected metrics

                      </span>
                      <span slot='details-header'>Technical details</span>
                      <span slot='details-content'>
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
                          <b>Network embeddings similarity:</b> this measure requires incremental training of node embedding
                          models
                          of networks of subsequent years. Node embeddings are obtained by the node2vec algorithm described in
                          [2]. The score between two years is computed by averaging node embeddings to represent a network and
                          taking cosine similarity between obtained network vectors. The score ranges from 0 to 1.
                        </li>
                        <br>
                        <h6><b>References</b></h6>
                        <ol>
                          <li>Golub, G. H., & Van Loan, C. F. (1996). Matrix computations. Johns Hopkins studies in the mathematical sciences.</li>
                          <li>Grover, A., & Leskovec, J. (2016, August). node2vec: Scalable feature learning for networks. In Proceedings of the 22nd ACM SIGKDD international conference on Knowledge discovery and data mining (pp. 855-864).</li>
                          <li>Hamilton, W. L., Leskovec, J., & Jurafsky, D. (2016, November). Cultural shift or linguistic drift? comparing two computational measures of semantic change. In Proceedings of the Conference on Empirical Methods in Natural Language Processing. Conference on Empirical Methods in Natural Language Processing (Vol. 2016, p. 2116). NIH Public Access.</li>
                          <li>Jaccard, P. (1912). The distribution of the flora in the alpine zone. 1. New phytologist, 11(2), 37-50.</li>
                          <li>Katerenchuk, D., & Rosenberg, A. (2018). Rankdcg: Rank-ordering evaluation measure. arXiv preprint arXiv:1803.00719.</li>
                        </ol>
                      </ul>
                      </span>
                    </info-collapsable>
                  </b-col>
                </b-row>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import InfoCollapsable from "@/components/InfoCollapsable";

export default {
  name: 'Info',
  components: {InfoCollapsable},
  props: {},
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    onTabClick(event) {
      this.mouseClick(event, 'info-tab');
    }
  },
  computed: {},
  watch: {}
};
</script>
<style>
.carousel-caption {
  color: #000000 !important;
}

.carousel-indicators li {
  background-color: #666d69 !important;
}

.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%666d69' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%666d69' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
}

.card-header ul li a {
  color: #158394 !important;
}
</style>
