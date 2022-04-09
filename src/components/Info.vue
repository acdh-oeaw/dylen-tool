<template>
  <b-row
    xl='12'
    class='justify-content-center mt-3 info-container'>
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
              fill
              card
            >
              <b-tab
                class='info-tab py-0'
                title='Start'
                active
                @click='onTabClick'
                style='overflow: hidden'
              >
                <b-row class='justify-content-md-center pt-0 mb-0' style='max-width:90%;margin:auto'>
                  <b-col lg='10' style='height: 100%;'>
                    <b-card-header header-bg-variant='info'>
                      <span style='color:white'>Welcome to DYLEN! Take a look at our tool's features</span>
                    </b-card-header>
                    <b-card-body
                      class='pt-0 pb-0 mt-0 mb-2'
                      style='max-height:90%;border:1px solid rgb(23 162 184);margin:auto'
                    >
                      <b-carousel
                        id='carousel-1'
                        class='mt-1'
                        :interval='0'
                        :controls='true'
                        :indicators='true'
                        background='#ababab'
                        style='text-shadow: 1px 1px 2px #333;'
                        label-next='Next slide'
                        label-prev='Previous slide'
                      >
                        <div style='color: black;'>
                          <b-carousel-slide
                            caption='Ego Network'
                            text='Explore the semantic neighborhood of a target word in different years'
                            :img-src="require('../assets/info/ego.png')"
                            img-alt='Ego Network Image'
                          ></b-carousel-slide>
                          <b-carousel-slide
                            caption='General Network (Party)'
                            text='Explore lexemes used by political parties in the Austrian Parliament'
                            :img-src="require('../assets/info/general.png')"
                            img-alt='General Network Party Image'
                          ></b-carousel-slide>
                          <b-carousel-slide
                            caption='General Network (Speaker)'
                            text='Explore lexemes used by individual speakers in the Austrian Parliament'
                            :img-src="require('../assets/info/speaker.png')"
                            img-alt='General Network Speaker Image'
                          ></b-carousel-slide>
                          <b-carousel-slide
                            caption='Node Metrics Comparison'
                            text='Compare nodes according to frequency and network metrics'
                            :img-src="require('../assets/info/parallel.png')"
                            img-alt='Node Metrics Comparison Image'
                          ></b-carousel-slide>
                          <b-carousel-slide
                            caption='Times Series Analysis'
                            text='Track frequency/similarity changes over time'
                            :img-src="require('../assets/info/timeseries.png')"
                            img-alt='Time Series Analysis Image'
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
                          <b-card-header header-tag='header' class='p-1' role='tab'>
                            <b-button block v-b-toggle.accordion-1 variant='info'
                                      data-sauto-id='info-collapsable-button'>About DYLEN
                            </b-button>
                          </b-card-header>
                          <b-collapse id='accordion-1' visible accordion='my-accordion' role='tabpanel'>
                            <b-card-body>
                              <b-card-text class='text-left'>
                                <p>
                                  <b>DYLEN</b> Tool is an <b>interactive visualization tool</b>, which helps
                                  users to gain insight into the dynamics of the Austrian German lexicon
                                  over 20 years in the recent past and to measure semantic change, based on two
                                  different text corpora, the <b>Austrian Media Corpus (AMC)</b> and the <b>Corpus of
                                  Austrian Parliamentary Records (ParlAT)</b>
                                </p>
                                <p>
                                <h5>How to use DYLEN</h5>
                                DYLEN provides visualizations of three different network types:<br>
                                <ul>
                                  <li><b>Ego Network:</b> This network type allows you to explore the semantic
                                    neighborhoods of target words in different years.
                                  </li>
                                  <li><b>General Network (Party):</b> This network type allows you to explore lexemes
                                    used by political parties in the Austrian Parliament.
                                  </li>
                                  <li><b>General Network (Politicians):</b> This network type allows you to explore
                                    lexemes used by individual speakers in the Austrian Parliament.
                                  </li>
                                </ul>
                                <p>
                                  Select the network type you would like to explore at the top of the tool.
                                </p>
                                <p>
                                  Click on the corresponding tabs for more information on each network type and
                                  different visualization options.<br>
                                </p>
                                <p>
                                  Learn more about the project here: <a href='https://dylen.acdh.oeaw.ac.at' target='_blank'>https://dylen.acdh.oeaw.ac.at</a>.<br>
                                </p>
                                Code available on Github:
                                <ul>
                                  <li>Frontend: <a href='https://github.com/acdh-oeaw/dylen-tool' target='_blank'>https://github.com/acdh-oeaw/dylen-tool</a>
                                  </li>
                                  <li>Backend: <a href='https://github.com/acdh-oeaw/dylen-backend' target='_blank'>https://github.com/acdh-oeaw/dylen-backend</a>
                                  </li>
                                </ul>
                              </b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                        <b-card no-body class='mb-1'>
                          <b-card-header header-tag='header' class='p-1' role='tab'>
                            <b-button block v-b-toggle.accordion-2 variant='info'
                                      data-sauto-id='info-collapsable-button'>About Corpora/Data
                            </b-button>
                          </b-card-header>
                          <b-collapse id='accordion-2' accordion='my-accordion' role='tabpanel'>
                            <b-card-body>
                              <b-card-text class='text-left'>
                                <p>
                                  Two Corpora were used to generate linguistic network data:</p>
                                <ul>
                                  <li><b>Austrian Media Corpus (AMC)</b></li>
                                  <li><b>Corpus of Austrian Parliamentary Records (ParlAT)</b></li>
                                </ul>
                                <h5>Austrian Media Corpus (AMC)</h5>
                                AMC covers almost the entire Austrian print media landscape of the few decades,
                                containing more than 40 million texts (more than 10 billion tokens).<br>
                                For DYLEN, AMC was divided into multiple subcorpora, containing articles from different
                                Austrian newspapers and magazines from 1996 to 2017<br>
                                Some of the subcorpora available for visualizations represent combinations of various
                                media sources:
                                <ul>
                                  <li>All magazines</li>
                                  <li>All newspapers</li>
                                  <li>All magazines and newspapers</li>
                                </ul>
                                Other subcorpora available for visualizations represent individual publications:
                                <ul>
                                  <li>Falter</li>
                                  <li>Kleine Zeitung</li>
                                  <li>Kurier</li>
                                  <li>Die Presse</li>
                                  <li>Profil</li>
                                  <li>Der Standard</li>
                                </ul>
                                <h5>Corpus of Austrian Parliamentary Records (ParlAT)</h5>
                                The ParlAT Corpus contains the parliamentary records of the National Chamber
                                (Nationalrat) – one of two chambers of the Austrian parliament. <br>
                                The ParlAT covers the official shorthand transcripts from 1996 – 2017 and contains more
                                than 75 million tokens. <br>
                                Besides being linguistically annotated (part-of-speech tagged and lemmatized), the
                                corpus also contains semantic annotations for example all speakers are identified and
                                marked up.
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
                        <p>Ego network visualizations of a selected target word provide information about its <b>semantic
                        neighborhood</b> in a given year.<br>
                        The nodes in the network represent the <b>top-50 lexemes</b> that are <b>semantically most closely related</b> to a target word according to the applied semantic model. <br>
                          Please have a look into the <code>Technical details</code> section for more information about the semantic model.
                        </p>
                      </span>
                      <span slot='use-case-header'>
                        Use Ego Network to ...
                      </span>
                      <span slot='use-case-content'>
                        <p>
                        The Ego Network visualization could be used to answer following questions:
                        </p>
                        <ul>
                          <li>How did the usage of a word change over time (e.g. 'stationär')?
                            <ul>
                              <li>Use the year slider to investigate.</li>
                            </ul>
                          <li>Does a word have distinct meanings/usages?
                            <ul>
                              <li>Click on <code>show clusters</code> checkbox.</li>
                            </ul>
                          </li>
                          <li>Which meaning of the word was dominant in a given year?
                            <ul>
                              <li>Compare number of nodes in a cluster / sizes of the nodes. </li>
                            </ul>
                          </li>
                          <li>How does the usage of near-synonyms differ? (e.g. 'Beitragserhöhung' vs. 'Steuererhöhung')
                            <ul>
                              <li>Visualize two networks in parallel.</li>
                            </ul>
                          </li>
                          <li>How similar are the words in a network?
                            <ul>
                              <li>Compare thickness of edges.</li>
                            </ul>
                          </li>
                        </ul>
                      </span>
                      <span slot='guide-header'>
                        How to use Ego Network
                      </span>
                      <span slot='guide-content'>
                        <ol>
                          <li>
                            Select <code>Ego Network</code> in the Top Navigation bar.
                          </li>
                          <li>
                            Select a corpus from the corpus dropdown menu. <br>
                          </li>
                          <li>
                            Select a subcorpus from the subcorpus dropdown menu
                          </li>
                          <li>
                            Type a target word into the input field and select one of the autocomplete suggestions
                          </li>
                          <li>Click <code>Visualize</code></li>
                        </ol>
                        <h5>How to interpret ego networks</h5>
                        <ul>
                          <li>The target word itself is <b>not displayed</b> in the visualized ego network, since by definition every node in the network is connected to the target word by an edge.
                          </li>
                          <li>The <b>size of the nodes</b> represents word frequency</li>
                          <li>The <b>thickness of the edges</b> represents the semantic similarity between nodes</li>
                          <li>The <b>colors of the labels</b> represent different part-of-speech tags</li>
                          <li>The <b>colors of the nodes</b> represent semantic clusters, which may sometimes be interpreted as polysemic meanings or distinct usage contexts, it can be enbaled by clicking on the checkbox <code>"show clusters"</code></li>
                          <li>Right click on a node to see its exact node metrics</li>
                          <li>Right click on a node to visualize its word as the target word</li>
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
                          connections between respective the nodes.
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
                        General network visualizations of a selected party or speaker in parliament provide information about their
                        discourse topics in a given year.<br>
                        The nodes in the network represent the <b>most frequent lexemes</b> in the subcorpus representing the speech of a selected party or speaker.<br>
                      </span>
                      <span slot='use-case-header'>
                        Use General Network to ...
                      </span>
                      <span slot='use-case-content'>
                        <p>
                        The General Network visualization could be used to answer following questions.
                        </p>

                        <ul>
                          <li>What do parties focus on in their speeches in the Austrian parliament?
                            <ul>
                              <li>Investigate General Network (Party).</li>
                            </ul>
                          </li>
                          <li>What do individual politicians focus on in the Austrian parliament?
                            <ul>
                              <li>Investigate General Network (Speaker).</li>
                            </ul>
                          </li>
                          <li>How do lexical choices differ between politicians/parties?
                            <ul>
                              <li>Visualize two networks in parallel.</li>
                            </ul>
                          </li>
                          <li>Does the general content of politicians' speeches remain stable or does it change over time?
                            <ul>
                              <li>Use the year slider to investigate.</li>
                            </ul>
                          </li>
                        </ul>
                      </span>
                      <span slot='guide-header'>How to use General Network</span>
                      <span slot='guide-content'>
                        <ol>
                          <li>
                            Select <code>General Network (Party)</code> or <code>General Network (Speaker)</code> in the Top Navigation bar.
                          </li>
                          <li>
                            Select a party from the dropdown menu. <br>
                            (Only for <code>General Network (Speaker)</code>)
                            Select a speaker from the dropdown menu.
                          </li>
                          <li>
                            (Optional) Select a <code>Node Filter Metric</code> you want to use to filter the nodes from the dropdown menu.<br>
                            General networks are very large in size, and visualizing the network is computationally expensive.<br>
                            The node metric filter is used to select only a specific number of nodes based on the selected metrics,
                            <code>degree centrality</code> is the default selection.
                          </li>
                          <li>
                            (Optional) Adjust the <code>Node Filter</code>. Too wide a range may cause long waiting times or might even freeze the browser.
                          </li>
                          <li>Click <code>Visualize</code>.</li>
                        </ol>
                          <h5>How to interpret general networks</h5>
                            <ul>
                              <li>The <b>size of the nodes</b> represents word frequency</li>
                              <li>The <b>thickness of the edges</b> represents the semantic similarity between nodes</li>
                              <li>The <b>colors of the labels</b> represent different part-of-speech tags</li>
                              <li>Right click on a node to see its exact node metrics</li>
                            </ul>
                      </span>
                      <span slot='details-header'>Technical details</span>
                      <span slot='details-content'>
                        For semantic modeling, we utilize a <b>distributional word embedding</b> model, namely a neural network
                        based <b>skip-gram with negative-sampling</b> architecture from a word2vec package. The model is trained
                        on the chosen corpus and it produces a word-vector correspondence based on co-occurrence statistics.
                        <br>
                        <b>Cosine similarity</b> is further applied to vector representations to determine the semantic
                        similarity between pairs of words, whcih is reflected in the strength of the connections between the respective nodes.
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
                      <span slot='definition'>What are Node Metrics?</span>
                      <span slot='definition-content'>
                        A network is a structure consisting of nodes and edges, and characteristics of nodes and edges can be described with different metrics.<br>
                        The <code>Node Metrics Comparison</code> component helps users to compare different networks based on <b>10 different node metrics</b>.
                        <br>
                        Details on the metrics used are described in the <b>Technical details</b> below.
                      </span>
                      <span slot='use-case-header'>Use Node Metrics Comparison for ...</span>
                      <span slot='use-case-content'>
                        <p>
                        The Node Metrics Comparison component could be used to answer following question.
                        </p>

                        <ul>
                          <li>Which word in a network has the highest number of semantic neighbors?
                            <ul>
                              <li>The node with the highest <code>degree centrality.</code></li>
                            </ul>
                          </li>
                          <li>To what extent do the words in one network differ in frequency?
                            <ul>
                              <li>Compare <code>normalized frequency.</code></li>
                            </ul>
                          </li>
                          <li>How many words are shared by two compared networks?
                            <ul>
                              <li>Use <code>Table View</code> and sort by Word. </li>
                            </ul>
                          </li>
                          <li>Which centrality measures capture similar characteristics of the network?
                            <ul>
                              <li>Use <code>Download CSV/JSON</code> to investigate correlations between <code>centrality metrics</code>, e.g. with R (<a
                                href='https://www.r-project.org/'>https://www.r-project.org/</a>).</li>
                            </ul>
                          </li>
                        </ul>
                      </span>
                      <span slot='guide-header'>How to use Node Metrics Comparison</span>
                      <span slot='guide-content'>
                        <h5><u>Parallel Coordinates</u></h5>
                        <p>
                          The DYLEN Parallel Coordinates visualization allows you to display node metrics of all nodes from up to two different networks.
                        </p>

                        <h6><b>Axes</b></h6>
                        <ul>
                          <li>
                            The <code>x-axis</code> represents the names of different node metrics, the <code>y-axis</code> shows their values.
                          </li>
                          <li>
                            5 of 10 available node metrics are visualized by default, more metrics can be added by clicking on the <code>settings</code> icon <b-icon
                            icon='gear'></b-icon> and enabling the metrics from the <code>Metrics to display</code> section. You can also change the order of the axes from settings
                          </li>
                        </ul>

                        <h6><b>Network Labels</b></h6>
                        <p>
                          The labels of the first and the second network are shown in the top left and top right position of the chart respectively.
                        </p>
                        <h6><b>Node Labels</b></h6>
                        <p>
                          The node labels are shown on the left and right side of the chart, overlapping words (words with the same/similar metric value on the first/last axis) are displayed as <code>*</code>,
                          the actual word can be viewed by hovering over the <code>*</code> character.
                        </p>
                        <h6><b>Select/Deselect nodes</b></h6>
                        <p>
                          Sometimes the number of nodes can make interpretation of parallel coordinates difficult. <br>
                          You can use the <code>deselect all</code> button to remove all nodes and manually select the nodes to be shown
                          from the <code>Network Visualization</code> or from the <code>Table View</code><br>
                          Individual nodes can be removed from the chart by clicking on the <code>'x'</code> icon, which appears when you hover over the node label.
                        </p>
                        <h6><b>Interactivity with Network Visualization</b></h6>
                        <p>
                          The <code>Network Visualization</code> and <code>Node Metrics Comparison</code> components share the same data. <br>
                          When you hover over the lines in the <code>Parallel Coordinates</code>, the corresponding node and its neighbors will be emphasized in the <code>Network Visualization</code> and vice versa.
                        </p>
                      </span>
                      <span slot='details-header'>Technical details</span>
                      <span slot='details-content'>
                        <a
                          href='https://en.wikipedia.org/wiki/Parallel_coordinates'
                          target='_blank'>Parallel coordinates</a> are used to visualize scores of different metrics for selected nodes, the x-axis provides the names of various node metrics, the y-axis
                            shows their values.<br>
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
                            assumption is that a node is as important as the combined importance of the nodes that link to it.
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
                          <li>
                            <b>
                              absolute frequency
                            </b> - is the number of occurences of the word in the selected subcorpus for the selected year.
                          </li>
                          <li>
                            <b>
                              normalized frequency
                            </b> - is the number of occurences of the word in the selected subcorpus for the selected year scaled to 0 and 1 with Min-Max scaler
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
                      <span slot='definition'>What is Time Series Analysis?</span>
                      <span slot='definition-content'>
                        <b>Time Series Analysis</b> allows you to track changes over time. <br>
                        Each graph indicates the diachronic development of a given target word according to frequency changes or measures of similarity.
                        See the <code>Technical details</code> section below for detailed descriptions of each of the measures.<br>
                      </span>
                      <span slot='use-case-header'>Use Time series analysis for ...</span>
                      <span slot='use-case-content'>
                        <p>
                        The Time Series Analysis component could be used to answer following questions.
                        </p>

                        <ul>
                          <li>Do the networks for a target word change over time?
                            <ul>
                              <li>Choose Metric: <code>jaccard similarity</code></li>
                            </ul>
                          </li>
                          <li>Does the frequency of a target word change over time?
                            <ul>
                              <li>Choose Metric: <code>frequency difference</code></li>
                            </ul>
                          </li>
                          <li>Do different similarity measures capture the same diachronic trends?
                            <ul>
                              <li>Use Table View to copy data and investigate correlations between similarity metrics, e.g. with R (<a
                                href='https://www.r-project.org/'>https://www.r-project.org/</a>). </li>
                            </ul>
                          </li>
                        </ul>
                      </span>
                      <span slot='guide-header'>How to use Time series analysis</span>
                      <span slot='guide-content'>
                        <p>
                          The Time series Analysis component visualizes the development of (absolute) differences between the values of selected metrics and a specific reference year.
                        </p>
                        <ol>
                          <li>Select the metric you would like to visualize from the <code>metric dropdown menu</code></li>
                          <li>Select the year you would like to compare the metrics to (first year, last year, previous year).</li>
                        </ol>

                        <h6><b>Axes</b></h6>
                        The years are displayed on the x-axis, the y-axis shows the values of the selected metrics.

                      </span>
                      <span slot='details-header'>Technical details</span>
                      <span slot='details-content'>
                        <p>
                        Each measure provides a single score by comparing data from two time periods, and thus produces three
                        time series graphs depending on which years are compared and in what order. <br>
                        The first perspective is to compare each consecutive year to the previous one, second - each consecutive
                        year to the first year,
                        and third - each subsequent year to the last year. <br>
                        Only the similarity score based on network embedding does not
                        follow the procedure described above. Instead of providing point-wise comparisons, this measure
                        adopts a cumulative strategy. The idea behind the cumulative approach is that semantic similarity is
                        defined not by a single previous year, but by all previous time periods.
                      </p>
                      <p>
                        All similarity scores are based on the network representation of a target word in different years.
                        Some of the measures make use only of network nodes lists (not the network itself), however
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
                          as the difference between adjacency matrices of target word networks in two years. Adjacency matrices
                          are pre-processed to represent the union of nodes of two time slices. The score does not have a fixed
                          range.
                        </li>
<!--                        this is not one of the options in the drop down menu-->
<!--                        <li>-->
<!--                          <b>Network embeddings similarity:</b> this measure requires incremental training of node embedding-->
<!--                          models-->
<!--                          of networks of subsequent years. Node embeddings are obtained by the node2vec algorithm described in-->
<!--                          [2]. The score between two years is computed by averaging node embeddings to represent a network and-->
<!--                          taking cosine similarity between the obtained network vectors. The score ranges from 0 to 1.-->
<!--                        </li>-->
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
import InfoCollapsable from '@/components/InfoCollapsable';

export default {
  name: 'Info',
  components: { InfoCollapsable },
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
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%666d69' aria-label='previous image' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%666d69' aria-label='next image' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
}

.info-container .card-header {
  color: white !important;
  background-color: rgb(23 162 184) !important;
}

.info-container .card {
  border: 1px solid rgb(23 162 184) !important;
}

.info-container .card-header li a {
  color: white !important;
}

.info-container .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link {
  color: rgb(23 162 184) !important;
}

.carousel {
  width: 90% !important;
  margin: auto !important;
}
</style>
