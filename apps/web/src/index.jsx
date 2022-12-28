import React from "react";
import ReactDOM from "react-dom";
import {Provider as ReduxProvider} from "react-redux";
import {ReduxRouter as Router} from "@lagunovsky/redux-react-router";
import {store, history} from "./redux/store";
import App from "./components/App";

ReactDOM.render(
        <ReduxProvider store={store}>
            <Router history={history}>
                <App/>
            </Router>
        </ReduxProvider>,
    document.getElementById('root')
);
