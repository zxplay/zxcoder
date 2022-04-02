import React from "react";
import {Route, Switch} from "react-router-dom";
import Demo from "./pages/Demo";
import MaxWidth from "./MaxWidth";
import LegalPrivacy from "./pages/LegalPrivacy";
import LegalTerms from "./pages/LegalTerms";
import ProjectNew from "./pages/ProjectNew";
import Project from "./pages/Project";
import About from "./pages/About";
import Linking from "./pages/Linking";
import YourProfile from "./pages/YourProfile";
import YourProjects from "./pages/YourProjects";
import Search from "./pages/Search";
import ErrorNotFound from "./pages/ErrorNotFound";

export default function Routes() {
    return (
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
    )
}
