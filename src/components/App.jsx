import React, {Fragment} from "react";
import {useSelector} from "react-redux";
import {Route, Switch} from "react-router-dom";
import queryString from "query-string";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import ErrorBoundary from "./common/ErrorBoundary";
import RenderEmulator from "./RenderEmulator";
import LoadingScreen from "./common/LoadingScreen";
import LockScreen from "./common/LockScreen";
import Nav from "./Nav";
import Demo from "./pages/Demo";
import MaxWidth from "./common/MaxWidth";
import About from "./pages/About";
import Linking from "./pages/Linking";
import LegalPrivacy from "./pages/LegalPrivacy";
import LegalTerms from "./pages/LegalTerms";
import ProjectNew from "./pages/ProjectNew";
import Project from "./pages/Project";
import Search from "./pages/Search";
import YourProfile from "./pages/YourProfile";
import YourProjects from "./pages/YourProjects";
import ErrorNotFound from "./pages/ErrorNotFound";

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
                    <Switch>
                        <Route exact path="/">
                            <Demo/>
                        </Route>
                        <Route exact path="/about">
                            <MaxWidth>
                                <About/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/info/linking">
                            <MaxWidth>
                                <Linking/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/legal/privacy-policy">
                            <MaxWidth>
                                <LegalPrivacy/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/legal/terms-of-use">
                            <MaxWidth>
                                <LegalTerms/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/new/asm">
                            <MaxWidth>
                                <ProjectNew type="asm"/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/new/basic">
                            <MaxWidth>
                                <ProjectNew type="basic"/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/new/c">
                            <MaxWidth>
                                <ProjectNew type="c"/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/new/sdcc">
                            <MaxWidth>
                                <ProjectNew type="sdcc"/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/new/zmac">
                            <MaxWidth>
                                <ProjectNew type="zmac"/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/new/zxbasic">
                            <MaxWidth>
                                <ProjectNew type="zxbasic"/>
                            </MaxWidth>
                        </Route>
                        <Route exact path="/projects/:id" render={(match) => {
                            return (
                                <Project id={match?.match?.params?.id}/>
                            )
                        }}/>
                        <Route path="/search">
                            <Search/>
                        </Route>
                        <Route exact path="/u/:id" render={(match) => {
                            return (
                                <YourProfile id={match?.match?.params?.id}/>
                            )
                        }}/>
                        <Route exact path="/u/:id/projects" render={(match) => {
                            return (
                                <YourProjects id={match?.match?.params?.id}/>
                            )
                        }}/>
                        <Route>
                            <ErrorNotFound/>
                        </Route>
                    </Switch>
                </ErrorBoundary>
            </div>
        </Fragment>
    )
}
