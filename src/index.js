import React from "react";
import ReactDOM from "react-dom";
import {Provider as ReduxProvider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {store} from "./redux/store";
import App from "./components/App";

ReactDOM.render(
    <ReduxProvider store={store}>
        <Router>
            <App/>
        </Router>
    </ReduxProvider>,
    document.getElementById('root')
);
