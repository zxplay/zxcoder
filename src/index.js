import React from "react";
import ReactDOM from "react-dom";
import {Provider as ReduxProvider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import {store, history} from "./redux/store";
import LoadingScreen from "./components/LoadingScreen";
import LockScreen from "./components/LockScreen";
import App from "./components/App";
import Constants from "./constants";
import Config from "../config.json";

ReactDOM.render(
    <ReduxProvider store={store}>
        <ConnectedRouter history={history}>
            <LoadingScreen/>
            <LockScreen/>
            <App/>
        </ConnectedRouter>
        {!Constants.isDev &&
            <script
                defer
                data-domain={Config.domain}
                data-api="/plausible/api/event"
                src="/plausible/js/script.js"
            />
        }
    </ReduxProvider>,
    document.getElementById('root')
);
