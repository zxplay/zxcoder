import React from "react";
import {useSelector} from "react-redux";
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
                    <InfoAbout/>
                </MaxWidth>
            </Route>
            <Route exact path="/info/linking">
                <MaxWidth>
                    <InfoLinking/>
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
