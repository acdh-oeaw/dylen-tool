import { DylenDispatchTypes, DylenDataType, DYLEN_LOADING, DYLEN_FAIL, DYLEN_SUCCESS } from "../actions/DylenActionTypes";

interface DefaultStateI {
  loading: boolean,
  data?: DylenDataType
}

const defaultState = {
  loading: false
};

const dylenReducer = (state: DefaultStateI = defaultState, action: DylenDispatchTypes) : DefaultStateI => {
  switch (action.type) {
    case DYLEN_LOADING:
      return {
        loading: true,
      };
    case DYLEN_FAIL:
      return {
        loading: false,
      };
    case DYLEN_SUCCESS:
      return {
        loading: false,
        data: action.payload
      };
    default:
      return state;
  }
}

export default dylenReducer;