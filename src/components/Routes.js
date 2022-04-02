import React from "react";
import {Route, Switch} from "react-router-dom";
import Demo from "./pages/Demo";
import MaxWidth from "./MaxWidth";
import InfoLegalPrivacy from "./pages/InfoLegacyPrivacy";
import InfoLegalTerms from "./pages/InfoLegalTerms";
import ProjectNew from "./pages/ProjectNew";
import Project from "./pages/Project";
import InfoAbout from "./pages/InfoAbout";
import InfoLinking from "./pages/InfoLinking";
import YourProfile from "./pages/YourProfile";
import YourProjects from "./pages/YourProjects";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Demo/>
            </Route>
            <Route exact path="/about">
                <MaxWidth>
                    <InfoAbout/>
                </MaxWidth>
            </Route>
            <Route exact path="/info/linking">
                <MaxWidth>
                    <InfoLinking/>
                </MaxWidth>
            </Route>
            <Route exact path="/legal/privacy-policy">
                <MaxWidth>
                    <InfoLegalPrivacy/>
                </MaxWidth>
            </Route>
            <Route exact path="/legal/terms-of-use">
                <MaxWidth>
                    <InfoLegalTerms/>
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
                <NotFound/>
            </Route>
        </Switch>
    )
}
