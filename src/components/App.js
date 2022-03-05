import React from "react";
import {Provider as ReduxProvider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {store, history} from "../redux/store";
import RenderEmulator from "../components/RenderEmulator";
import LoadingScreen from "../components/LoadingScreen";
import LockScreen from "../components/LockScreen";
import Nav from "./Nav";
import Routes from "./Routes";

export default function App() {
    return (
        <ReduxProvider store={store}>
            <ConnectedRouter history={history}>
                <RenderEmulator/>
                <LoadingScreen/>
                <LockScreen/>
                <div className="pb-1">
                    <Nav/>
                    <Routes/>
                </div>
            </ConnectedRouter>
        </ReduxProvider>
    )
}
