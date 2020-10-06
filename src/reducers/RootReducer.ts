import {combineReducers} from "redux";
import dylenReducer from "./DylenReducer";

const RootReducer = combineReducers({
  dylen: dylenReducer
});

export default RootReducer;