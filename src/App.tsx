import React from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "./Store";
import {GetAvailableCorpora} from "./actions/DylenActions";

function App() {
  const dispatch = useDispatch();
  const dylenState = useSelector((state: RootStore) => state.dylen)

  const handleSubmit = () => dispatch(GetAvailableCorpora());

  console.log(dylenState);

  return (
    <div className="App">
      <button onClick={handleSubmit}>Load</button>
    </div>
  );
}

export default App;
