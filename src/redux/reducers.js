const initialState = {
  availableQueryParams: [
  ],
  activeEgoNetworkQueries: [
    /*
    {
      "corpus": "AMC",
      "subcorpus": "KRONE",
      "text": "Regierung",
      "year": 2015
      "networkID": "e30a678b-f0bd-40dc-bed1-819b0d23c302",
      "networkData": {
        "id": "e30a678b-f0bd-40dc-bed1-819b0d23c302",
        "text": "Regierung",
        "year": 2015,
        "corpusId": "AMC",
        "sourceId": "KRONE",
        "absFreq": 3661,
        "relFreq": 3.693207E-4,
        "threshold": 0.6,
        "nodes": [
          {
            "id": "1",
            "clusterId": 0,
            "text": "Brüssel",
            "pos": "noun",
            "similarity": 0.9518243,
            "absFreq": 1670,
            "relFreq": 1.5206943E-4
          },
          ...
        ]
      }
    }
    */
  ]
};

export const availableQueryParams = (state = initialState["availableQueryParams"], action) => {
  switch(action.type) {
      case 'FETCH_AVAILABLE_QUERY_PARAMS_SUCCESS':
        state = action.payload;
        return state;
      default:
        return state;
  }
}

export const activeEgoNetworkQueries = (state = initialState["activeEgoNetworkQueries"], action) => {
  switch(action.type) {
      case 'FETCH_NETWORK_SUCCESS':
        state.push(action.payload);
        return state;
      default:
        return state;
  }
}