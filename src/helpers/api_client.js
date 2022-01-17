import {
    allQueriesToReponseProperty,
    getGeneralNetworkTimeSeries,
    getMetadataSpeaker,
    getTargetWordByIdQuery
} from "@/queries/queries";
import {partyMapping, zipTimeSeriesAndYears} from "@/helpers/mappers";
import axios from "axios";
import props from "@/properties/propertiesLoader";
import {EGO_NETWORK, GENERAL_PARTY, GENERAL_SPEAKER} from "@/helpers/mixins";

const graphqlEndpoint = props.graphqlEndpoint;

function timeSeriesQueryByType(type, entity) {
    switch (type) {
        case EGO_NETWORK:
            return getTargetWordByIdQuery(entity)
        case GENERAL_PARTY:
            return getGeneralNetworkTimeSeries(partyMapping[entity])
        case GENERAL_SPEAKER:
            return getMetadataSpeaker(entity)
    }
}

function convertGeneralTimeSeriesMetricNames(timeSeries) {
    return {
        "frobeniusSimilarity": timeSeries.frobenius_similarity,
        "rankdcgSimilarity": timeSeries.rankdcg_similarity,
        "jaccardSimilarity": timeSeries.jaccard_similarity
    };
}


export async function getGeneralTimeSeries(type, entity) {
    const query = timeSeriesQueryByType(type, entity)
    let response = await axios.post(graphqlEndpoint, query)
    const responseProperty = type === GENERAL_PARTY ? allQueriesToReponseProperty.GET_AVAILABLE_YEARS_FOR_PARTY : allQueriesToReponseProperty.GET_METADATA_SPEAKER
    let timeSeries = response.data.data[responseProperty] || {};
    let years = timeSeries.available_years.sort();

    return zipTimeSeriesAndYears(convertGeneralTimeSeriesMetricNames(timeSeries), years);
}

export async function getEgoNetworkTimeSeries(state, pane) {
    const response = await axios.post(graphqlEndpoint,
        getTargetWordByIdQuery(state[pane].selectedTargetword.id));
    let timeSeries = response.data.data[allQueriesToReponseProperty.GET_TARGETWORD_BY_ID].timeSeries || {};
    let years = response.data.data.getTargetWordById.networks.map(e => e.year).slice().sort();
    return zipTimeSeriesAndYears(timeSeries, years);
}

