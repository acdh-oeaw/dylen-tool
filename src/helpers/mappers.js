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
  "KPÖ": "KPOe",
  "PILZ-JETZT": "PILZ-JETZT",
  "GRÜNE": "GRUeNE",
  "NEOS": "LIF-NEOS",
  "STRONACH": "STRONACH",
  "SPÖ": "SPOe",
  "BZÖ": "BZOe"
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
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
    "all":"All parliamentary records"
}

export function filterBasedOnSlider(network) {
  let metricValues = network.nodes.map(node => {
    switch(network.filter.metric) {
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

  const sliderMin = network.filter.valueMin;
  const sliderMax = network.filter.valueMax;

  let filteredNodes = network.nodes.filter(node => {
    switch(network.filter.metric) {
      case "Degree Centrality":
        return node.metrics.degree_centrality <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.degree_centrality > minVal + (maxVal-minVal)*sliderMin;
      case "Eigenvector Centrality":
        return node.metrics.eigenvector_centrality <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.eigenvector_centrality > minVal + (maxVal-minVal)*sliderMin;
      case "Betweenness Centrality":
        return node.metrics.betweenness_centrality <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.betweenness_centrality > minVal + (maxVal-minVal)*sliderMin;
      case "Load Centrality":
        return node.metrics.load_centrality <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.load_centrality > minVal + (maxVal-minVal)*sliderMin;
      case "Pagerank":
        return node.metrics.pagerank <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.pagerank > minVal + (maxVal-minVal)*sliderMin;
      case "Clustering Coefficient":
        return node.metrics.clustering_coefficient <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.clustering_coefficient > minVal + (maxVal-minVal)*sliderMin;
      case "Harmonic Centrality":
        return node.metrics.harmonic_centrality <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.harmonic_centrality > minVal + (maxVal-minVal)*sliderMin;
      case "Closeness Centrality":
        return node.metrics.closeness_centrality <= minVal + (maxVal-minVal)*sliderMax &&
          node.metrics.closeness_centrality > minVal + (maxVal-minVal)*sliderMin;
      default: true
    }
  });

  let filteredIds = filteredNodes.map(node => node.id).sort();

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
                };
            });
            newTimeSeries[timeSeriesKeyMap[key]][relativeToMap[metric]] = zippedArray;
        });
    });
    console.log(newTimeSeries)
    return newTimeSeries;
}
