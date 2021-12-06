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
