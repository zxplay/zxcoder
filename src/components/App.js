import React, {Fragment, useEffect} from "react";
import {Provider as ReduxProvider} from "react-redux";
import {Switch, Route} from "react-router-dom";
import {ConnectedRouter} from "connected-react-router";
import {useDispatch, useSelector} from "react-redux";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {store, history} from "../redux/store";
import LoadingScreen from "../components/LoadingScreen";
import LockScreen from "../components/LockScreen";
import MaxWidth from "./MaxWidth";
import Nav from "./Nav";
import Demo from "./Demo";
import Project from "./Project";
import NewProject from "./NewProject";
import YourProjects from "./YourProjects";
import YourProfile from "./YourProfile";
import About from "./About";
import Search from "./Search";
import NotFound from "./NotFound";
import {exit, renderEmulator} from "../redux/actions/jsspeccy";

export default function App() {
    return (
        <ReduxProvider store={store}>
            <ConnectedRouter history={history}>
                <LoadingScreen/>
                <LockScreen/>
                <div className="pb-1">
                    <RenderEmulator/>
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

function Routes() {
    const projectType = useSelector(state => state?.project.type);
    const projectReady = useSelector(state => state?.project.ready);
    return (
        <Switch>
            <Route exact path="/">
                {!projectType &&
                    <Demo/>
                }
                {projectType && !projectReady &&
                    <MaxWidth>
                        <NewProject/>
                    </MaxWidth>
                }
                {projectType && projectReady &&
                    <Project/>
                }
            </Route>
            <Route exact path="/about">
                <MaxWidth>
                    <About/>
                </MaxWidth>
            </Route>
            <Route exact path="/profile">
                <YourProfile/>
            </Route>
            <Route exact path="/projects">
                <YourProjects/>
            </Route>
            <Route path="/search">
                <Search/>
            </Route>
            <Route>
                <NotFound/>
            </Route>
        </Switch>
    )
}
