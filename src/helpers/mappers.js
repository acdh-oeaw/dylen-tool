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
  let selected_metric = ""
  switch(network.filter.metric) {
    case "Degree Centrality":
      selected_metric = "degree_centrality"; break;
    case "Eigenvector Centrality":
      selected_metric = "eigenvector_centrality"; break;
    case "Betweenness Centrality":
      selected_metric = "betweenness_centrality"; break;
    case "Load Centrality":
      selected_metric = "load_centrality"; break;
    case "Pagerank":
      selected_metric = "pagerank"; break;
    case "Clustering Coefficient":
      selected_metric = "clustering_coefficient"; break;
    case "Harmonic Centrality":
      selected_metric = "harmonic_centrality"; break;
    case "Closeness Centrality":
      selected_metric = "closeness_centrality"; break;
    default: true
  }

  network.nodes.sort((a, b) => a.metrics[selected_metric] - b.metrics[selected_metric]);
  let filteredNodes = network.nodes.slice(Math.round(network.nodes.length * network.filter.valueMin), Math.round(network.nodes.length * network.filter.valueMax));

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
                };
            });
            newTimeSeries[timeSeriesKeyMap[key]][relativeToMap[metric]] = zippedArray;
        });
    });
    console.log(newTimeSeries)
    return newTimeSeries;
}
