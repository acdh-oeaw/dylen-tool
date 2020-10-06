import {Dispatch} from "redux";
import {DylenDispatchTypes, DYLEN_LOADING, DYLEN_FAIL, DYLEN_SUCCESS} from "./DylenActionTypes";
import axios from "axios";

export const GetAvailableCorpora = () => async (dispatch: Dispatch<DylenDispatchTypes>) => {
  try {
    dispatch({
      type: DYLEN_LOADING
    })

    const corporaQuery = {
      query: `{
        allAvailableCorpora {
          id
          name
        }
      }`
    };

    const res = await axios.post('https://dylen-ego-network-service.acdh-dev.oeaw.ac.at/graphql', corporaQuery)

    dispatch({
      type: DYLEN_SUCCESS,
      payload: res.data
    })

  } catch (e) {

    dispatch({
      type: DYLEN_FAIL
    })

  }
}