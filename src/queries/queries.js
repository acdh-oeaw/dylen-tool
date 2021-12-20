export const allAvailableCorporaQuery = {
  query: `{
        allAvailableCorpora
    }`
};

export function getNetworksByCorpusAndSource(corpus, source, page, size) {
  const query = {
    query: `{
                        getNetworksByCorpusAndSource(corpus: "${corpus}", source: "${source}", page: ${page}, size: ${size}) {
                            sliceNumber
                            hasNext
                            targetWords {
                                id
                                text
                                pos
                                networks {
                                    year
                                }
                            }
                        }
                    }`
  };
  return query;
}

export function getSourcesByCorpusQuery(corpus) {
  const query = {
    query: `{
            getSourcesByCorpus(corpus: "${corpus}")
        }`
  };
  return query;
}

export function getNetworkQuery(targetwordId, year) {
  const query = {
    query: `{
            getNetwork(targetword_id: "${targetwordId}", year:${year}){
                year
                nodes {
                    id
                    clusterId
                    text
                    pos
                    similarity
                    metrics {
                      degreeCentrality
                      closenessCentrality
                      betweennessCentrality
                      eigenvectorCentrality
                      pagerank
                      loadCentrality
                      harmonicCentrality
                      clusteringCoefficient
                    }
                }
                edges {
                    node1
                    node2
                    similarity
                }
            }
          }`
  };
  return query;
}

export function getGeneralNetworkQuery(entity, year) {
  const query = {
    query: `{
      getGeneralSourceByPartyYear(entity: "${entity}", year: "${year}") {
        entity
        networks {
          year
          nodes {
            id
            clusterId
            text
            pos
            absolute_frequency
            normalized_frequency
            metrics {
              degree_centrality
              closeness_centrality
              betweenness_centrality
              eigenvector_centrality
              pagerank
              load_centrality
              harmonic_centrality
              clustering_coefficient
            }
          }
          edges {
            node1
            node2
            similarity
          }
        }
      }
    }`
  };
  return query;
}

export function getTargetWordByIdQuery(targetwordId) {
  const query = {
    query: `{
      getTargetWordById(targetword_id: "${targetwordId}") {
          id
          text
          pos
          networks {
              id
              year
          }
          timeSeries {
              freqDiffNorm {
                  firstYear
                  lastYear
                  previousYear
              }
              jaccardSimilarity {
                  firstYear
                  lastYear
                  previousYear
              }
              frobeniusSimilarity {
                  firstYear
                  lastYear
                  previousYear
              }
              rankdcgSimilarity {
                  firstYear
                  lastYear
                  previousYear
              }
              localNeighbourhoodSimilarity {
                  firstYear
                  lastYear
                  previousYear
              }
          }
      }
  }
  `
  };
  return query;
}

export function getAutocompleteSuggestionsQuery(corpus, source, term){
    const query = {
      "query":`{getAutocompleteSuggestions(corpus:"${corpus}", source:"${source}", searchTerm: "${term}", page: 0, size: 10) {
            id
            corpus
            source
            pos
            text
       }
      }`
    }
    return query;

}

export function getAvailablePartiesQuery(){
    const query = {
      "query":`{getAutocompleteSuggestions() {
            id
            corpus
            source
            pos
            text
       }
      }`
    }
    return query;

}

export function getAvailableYearsForParty(party) {
  const query = {
    query: `{
      getAvailableYearsForParty(party: "${party}") {
        available_years
      }
    }`
  };

  return query;
}

export function getMetadataSpeaker(entityName) {
  const query = {
    query: `{
      getAvailableYearsForSpeaker(entity_name: "${entityName}") {
        available_years
        frobenius_similarity {
          previous_year
          last_year
          first_year
        }
        rankdcg_similarity {
          previous_year
          last_year
          first_year
        }
        jaccard_similarity {
          previous_year
          last_year
          first_year
        }
      }
    }`
  };

  return query;
}

export function getGeneralNetworkTimeSeries(party) {
  const query = {
    query: `{
      getAvailableYearsForParty(party: "${party}") {
        available_years
        frobenius_similarity {
          previous_year
          last_year
          first_year
        }
        rankdcg_similarity {
          previous_year
          last_year
          first_year
        }
        jaccard_similarity {
          previous_year
          last_year
          first_year
        }
      }
    }`
  };

  return query;
}

export function getSpeakersForParty(party){
    const query = {
      "query":`{findSpeakerByParty(party: "${party}") {
          speakers
        }
      }`
    }
    return query;

}

export function getGeneralSpeakerNetworkQuery(entityName){
    const query = {
      "query":`{
        getGeneralSourceBySpeakerYear(entity_name: "${entityName}") {
          type
          entity_name
          networks {
            year
            nodes {
              id
              clusterId
              text
              pos
              absolute_frequency
              normalized_frequency
              metrics {
                closeness_centrality
                betweenness_centrality
                pagerank
                eigenvector_centrality
                load_centrality
                harmonic_centrality
                clustering_coefficient
                degree_centrality
              }
            }
            edges {
              node1
              node2
              similarity
            }
          }
        }
      }`
    }
    return query;

}
