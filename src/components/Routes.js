import React from "react";
import {Route, Switch} from "react-router-dom";
import Demo from "./Demo";
import MaxWidth from "./MaxWidth";
import NewProject from "./NewProject";
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
                    <NewProject type="asm"/>
                </MaxWidth>
            </Route>
            <Route exact path="/new/basic">
                <MaxWidth>
                    <NewProject type="basic"/>
                </MaxWidth>
            </Route>
            <Route exact path="/new/zxbasic">
                <MaxWidth>
                    <NewProject type="zxbasic"/>
                </MaxWidth>
            </Route>
            <Route exact path="/profile">
                <YourProfile/>
            </Route>
            <Route exact path="/projects/:id" render={(match) => {
                return (
                    <Project id={match?.match?.params?.id}/>
                )
            }}/>
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
