import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Store";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./GridStyles.scss";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ConfirmProvider } from "material-ui-confirm";

function initialise() {
  if (cssHasLoaded("ag-theme-custom-react")) {
    ReactDOM.render(
      <Router>
        <Provider store={store}>
          <CssBaseline />
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </Provider>
      </Router>,

      document.getElementById("root")
    );
  } else {
    setTimeout(initialise, 100);
  }
}

function cssHasLoaded(theme) {
  const themeEl = document.createElement("div");
  document.body.appendChild(themeEl);
  try {
    themeEl.className = theme;
    const cellEl = document.createElement("div");
    cellEl.className = "ag-cell";
    themeEl.appendChild(cellEl);
    const computedStyle = window.getComputedStyle(cellEl);
    return parseFloat(computedStyle.paddingLeft) > 0;
  } finally {
    document.body.removeChild(themeEl);
  }
}

initialise();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
