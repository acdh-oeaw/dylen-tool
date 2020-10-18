import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Provider } from 'react-redux'
import store from './redux/store'
import { fetchAvailableQueryParams } from './redux/actions'
import App from './App';

//Dispatch the fetchAvailableQueryParams() before our root component renders
store.dispatch(fetchAvailableQueryParams())

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);