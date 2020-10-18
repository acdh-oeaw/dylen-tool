import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk'
import {availableQueryParams, activeEgoNetworkQueries} from './reducers'

//code to setup redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({availableQueryParams, activeEgoNetworkQueries});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

export default store