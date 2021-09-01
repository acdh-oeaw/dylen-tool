export const allAvailableCorporaQuery = {
    query: `{
        allAvailableCorpora {
          id
          name
          sources {
            name
            targetWords {
              id
              text
              pos
              networks {
                year
              }
            }
          }
        }
      }`
};

export function getNetworkQuery(targetwordId, year) {
    let query = {
        query:`{
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
    }
    return query;
}
