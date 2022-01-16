import {GENERAL_PARTY} from "@/helpers/vocabulary";
import {allQueriesToReponseProperty, getGeneralNetworkTimeSeries, getMetadataSpeaker} from "@/queries/queries";
import {partyMapping, zipTimeSeriesAndYears} from "@/helpers/mappers";
import axios from "axios";
import props from "@/properties/propertiesLoader";

const graphqlEndpoint = props.graphqlEndpoint;

function convertGeneralTimeSeriesMetricNames(timeSeries) {
    return {
        "frobeniusSimilarity": timeSeries.frobenius_similarity,
        "rankdcgSimilarity": timeSeries.rankdcg_similarity,
        "jaccardSimilarity": timeSeries.jaccard_similarity
    };
}

export async function getGeneralTimeSeries(type, entity) {
    const query = type === GENERAL_PARTY ? getGeneralNetworkTimeSeries(partyMapping[entity]) : getMetadataSpeaker(entity)
    let response = await axios.post(graphqlEndpoint, query)
    const responseProperty = type === GENERAL_PARTY ? allQueriesToReponseProperty.GET_AVAILABLE_YEARS_FOR_PARTY : allQueriesToReponseProperty.GET_METADATA_SPEAKER
    let timeSeries = response.data.data[responseProperty] || {};
    let years = timeSeries.available_years.sort();

    return zipTimeSeriesAndYears(convertGeneralTimeSeriesMetricNames(timeSeries), years);
}
