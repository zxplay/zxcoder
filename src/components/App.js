import React, {Fragment, useEffect} from "react";
import {Provider as ReduxProvider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import {useDispatch} from "react-redux";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import LoadingScreen from "../components/LoadingScreen";
import LockScreen from "../components/LockScreen";
import Nav from "./Nav";
import Routes from "./Routes";
import {store, history} from "../redux/store";
import {exit, renderEmulator} from "../redux/actions/jsspeccy";

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

function RenderEmulator() {
    const dispatch = useDispatch();

    // NOTE: Using simple component function so emulator is rendered early.

    useEffect(() => {
        dispatch(renderEmulator(2));
        return () => {dispatch(exit())}
    }, []);

    return (
        <Fragment/>
    )
}
