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

export function getSoucesByCorpusQuery(corpus) {
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

export function getAutocompleteSuggestionsQuery(corpus, source, term){
    const query = {
        query: `{
            getAutocompleteSuggestions(corpus: "${corpus}", source: "${source}", searchTerm: "${term}") {
                id
                text
                pos
                networks {
                    year
                }
            }
        }`
    }
    return query;
    
}
