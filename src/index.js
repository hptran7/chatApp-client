import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Switch, Route } from "react-router-dom";
import BaseLayout from "./components/BaseLayout";
import Login from "./components/Login";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./store/reducer";
import { setAuthenticationHeader } from "./utils/authenticate";

//*** Global Store ***//
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const token = localStorage.getItem("jsonwebtoken");
setAuthenticationHeader(token);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <BaseLayout>
          <Switch>
            <Route exact path="/" component={App}></Route>
            <Route exact path="/login" component={Login}></Route>
          </Switch>
        </BaseLayout>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
