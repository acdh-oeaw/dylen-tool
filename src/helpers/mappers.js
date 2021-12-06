export const timeSeriesKeyMap = {
    "freqDiffNorm": "frequency difference (normalised)",
    "jaccardSimilarity": "jaccard similarity",
    "frobeniusSimilarity": "frobenius similarity",
    "rankdcgSimilarity": "rankDCG similarity",
    "localNeighbourhoodSimilarity": "Local neighborhood similarity"
}
export const relativeToMap = {
    "firstYear": "first year",
    "lastYear": "last year",
    "previousYear": "previous year",
    "first_year": "first year",
    "last_year": "last year",
    "previous_year": "previous year"
}
export const partyMapping = {
  "FPÖ": "FPOe",
  "ÖVP": "OeVP",
  "GRÜNE": "GRUeNE",
  "NEOS": "NEOS-LIF",
  "SPÖ": "SPOe",
  "BZÖ": "BZOe"
}
export const corpusNameMapping = {
    "AMC": "Austrian Media Corpus",
    "ParlAT": "Corpus of Austrian Parliamentary Records"
}
export const sourceNameMapping = {
    "KURIER": "Kurier",
    "STANDARD": "Der Standard",
    "newsmag": "All newspapers and magazines",
    "news": "All newspapers",
    "mag": "All magazines",
    "PRESSE": "Die Presse",
    "PROFIL": "Profil",
    "ParlAT": "ParlAT",
    "FALTER": "Falter",
    "KLEINE": "Kleine Zeitung",
    "-":"All parliamentary records"
}

export function filterBasedOnSlider(network, metric, slider_val) {
  let metricValues = network.nodes.map(node => {
    switch(metric) {
      case "Degree Centrality":
        return node.metrics.degree_centrality;
      case "Eigenvector Centrality":
        return node.metrics.eigenvector_centrality;
      case "Betweenness Centrality":
        return node.metrics.betweenness_centrality;
      case "Load Centrality":
        return node.metrics.load_centrality;
      case "Pagerank":
        return node.metrics.pagerank;
      case "Clustering Coefficient":
        return node.metrics.clustering_coefficient;
      case "Harmonic Centrality":
        return node.metrics.harmonic_centrality;
      case "Closeness Centrality":
        return node.metrics.closeness_centrality;
      default: true
    }
  });

  let minVal = Math.min(...metricValues);
  let maxVal = Math.max(...metricValues);

  let filteredNodes = network.nodes.filter(node => {
    switch(metric) {
      case "Degree Centrality":
        return node.metrics.degree_centrality <= minVal + (maxVal-minVal)*slider_val;
      case "Eigenvector Centrality":
        return node.metrics.eigenvector_centrality <= minVal + (maxVal-minVal)*slider_val;
      case "Betweenness Centrality":
        return node.metrics.betweenness_centrality <= minVal + (maxVal-minVal)*slider_val;
      case "Load Centrality":
        return node.metrics.load_centrality <= minVal + (maxVal-minVal)*slider_val;
      case "Pagerank":
        return node.metrics.pagerank <= minVal + (maxVal-minVal)*slider_val;
      case "Clustering Coefficient":
        return node.metrics.clustering_coefficient <= minVal + (maxVal-minVal)*slider_val;
      case "Harmonic Centrality":
        return node.metrics.harmonic_centrality <= minVal + (maxVal-minVal)*slider_val;
      case "Closeness Centrality":
        return node.metrics.closeness_centrality <= minVal + (maxVal-minVal)*slider_val;
      default: true
    }
  });

  let filteredIds = filteredNodes.map(node => node.id);

  let filteredEdges = network.edges.filter(edge => {
    return filteredIds.includes(edge.node1) && filteredIds.includes(edge.node2);
  });

  network.nodes = filteredNodes;
  network.edges = filteredEdges;
}

export function zipTimeSeriesAndYears(timeSeries, years) {
    let newTimeSeries = {};
    console.log(timeSeries);
    Object.keys(timeSeries).forEach(key => {
        newTimeSeries[timeSeriesKeyMap[key]] = {};
        Object.keys(timeSeries[key]).forEach(metric => {
            let initIdx = 0;
            switch (metric) {
                case "firstYear":
                    initIdx = 1;
                    break;
                case "lastYear":
                    initIdx = 0;
                    break;
                case "previousYear":
                    initIdx = 1;
                    break;
            }
            let zippedArray = timeSeries[key][metric].map((val, idx) => {
                return {
                    year: years[idx + initIdx],
                    value: val
                }
            })
            newTimeSeries[timeSeriesKeyMap[key]][relativeToMap[metric]] = zippedArray;
        })
    })
    console.log(newTimeSeries)
    return newTimeSeries;
}
