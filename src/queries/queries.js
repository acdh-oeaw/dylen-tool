export const allQueriesToReponseProperty = {
    'ALL_AVAILABLE_CORPORA':'allAvailableCorpora',
    'GET_NETWORKS_BY_CORPUS_AND_SOURCE':'getNetworksByCorpusAndSource',
    'GET_SOURCES_BY_CORPUS_QUERY':'getSourcesByCorpus',
    'GET_NETWORK_QUERY':'getNetwork',
    'GET_GENERAL_NETWORK_QUERY':'getGeneralSourceByPartyYear',
    'GET_TARGETWORD_BY_ID':'getTargetWordById',
    'GET_AUTOCOMPLETE_SUGGESTIONS_QUERY':'getAutocompleteSuggestions',
    'GET_AVAILABLE_PARTIES':'getAutocompleteSuggestions',
    'GET_AVAILABLE_YEARS_FOR_PARTY':'getAvailableYearsForParty',
    'GET_METADATA_SPEAKER':'getAvailableYearsForSpeaker',
    'GET_GENERAL_NETWORK_TIME_SERIES':'getAvailableYearsForParty',
    'GET_SPEAKERS_FOR_PARTY':'findSpeakerByParty',
    'GET_GENERAL_SPEAKER_NETWORK_QUERY':'getGeneralSourceBySpeakerYear'
}
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
                absoluteFrequency
                normalisedFrequency
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
                    absoluteFrequency
                    normalisedFrequency
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
            normalised_frequency
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
              normalised_frequency
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
