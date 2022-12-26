import React, {Fragment} from "react";
import {useSelector} from "react-redux";
import queryString from "query-string";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import RenderEmulator from "./RenderEmulator";
import LoadingScreen from "./LoadingScreen";
import LockScreen from "./LockScreen";
import Nav from "./Nav";
import Routes from "./Routes";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {

    // Hide tabs when loading external tape files.
    const search = useSelector(state => state?.router.location.search);
    const parsed = queryString.parse(search);
    const externalLoad = typeof parsed.u !== 'undefined';

    return (
        <Fragment>
            <RenderEmulator/>
            <LoadingScreen/>
            <LockScreen/>
            <div className="pb-1">
                {!externalLoad &&
                    <Nav/>
                }
                <ErrorBoundary>
                    <Routes/>
                </ErrorBoundary>
            </div>
        </Fragment>
    )
}
