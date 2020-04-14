import React from "react";
import "./styles.css";
import CovidGraph from "./CovidGraph";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { reducer } from "./reducers";

const store = createStore(reducer, applyMiddleware(thunk));
export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <CovidGraph />
      </div>
    </Provider>
  );
}
