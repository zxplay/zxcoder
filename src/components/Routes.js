import React from "react";
import {Route, Switch} from "react-router-dom";
import Demo from "./Demo";
import MaxWidth from "./MaxWidth";
import ProjectNew from "./ProjectNew";
import Project from "./Project";
import InfoAbout from "./InfoAbout";
import InfoLinking from "./InfoLinking";
import YourProfile from "./YourProfile";
import YourProjects from "./YourProjects";
import Search from "./Search";
import NotFound from "./NotFound";

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
