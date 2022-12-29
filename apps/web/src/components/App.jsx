import React from "react";
import {useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
import queryString from "query-string";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import ErrorBoundary from "./ErrorBoundary";
import RenderEmulator from "./RenderEmulator";
import LoadingScreen from "./LoadingScreen";
import LockScreen from "./LockScreen";
import Nav from "./Nav";
import Demo from "./Demo";
import MaxWidth from "./MaxWidth";
import About from "./About";
import Linking from "./Linking";
import LegalPrivacy from "./LegalPrivacy";
import LegalTerms from "./LegalTerms";
import ProjectNew from "./ProjectNew";
import Project from "./Project";
import Search from "./Search";
import YourProfile from "./YourProfile";
import YourProjects from "./YourProjects";
import ErrorNotFound from "./ErrorNotFound";

export default function App() {
    // const err = useSelector(state => state?.error.msg);

    // Hide tabs when loading external tape files.
    const search = useSelector(state => state?.router.location.search);
    const parsed = queryString.parse(search);
    const externalLoad = typeof parsed.u !== 'undefined';

    /* TODO
    if (err) {
        return (
            <>
                <div className="pb-1">
                    <Nav/>
                </div>
            </>
        )
    }
    */

    return (
        <>
            <RenderEmulator/>
            <LoadingScreen/>
            <LockScreen/>
            <div className="pb-1">
                {!externalLoad &&
                    <Nav/>
                }
                <ErrorBoundary>
                    <Routes>
                        <Route exact path="/" element={<Demo/>}/>
                        <Route exact path="/about" element={<MaxWidth><About/></MaxWidth>}/>
                        <Route exact path="/info/linking" element={<MaxWidth><Linking/></MaxWidth>}/>
                        <Route exact path="/legal/privacy-policy" element={<MaxWidth><LegalPrivacy/></MaxWidth>}/>
                        <Route exact path="/legal/terms-of-use" element={<MaxWidth><LegalTerms/></MaxWidth>}/>
                        <Route exact path="/new/asm" element={<MaxWidth><ProjectNew type="asm"/></MaxWidth>}/>
                        <Route exact path="/new/basic" element={<MaxWidth><ProjectNew type="basic"/></MaxWidth>}/>
                        <Route exact path="/new/c" element={<MaxWidth><ProjectNew type="c"/></MaxWidth>}/>
                        <Route exact path="/new/sdcc" element={<MaxWidth><ProjectNew type="sdcc"/></MaxWidth>}/>
                        <Route exact path="/new/zmac" element={<MaxWidth><ProjectNew type="zmac"/></MaxWidth>}/>
                        <Route exact path="/new/zxbasic" element={<MaxWidth><ProjectNew type="zxbasic"/></MaxWidth>}/>
                        <Route exact path="/projects/:id" element={<Project/>}/>
                        <Route path="/search" element={<Search/>}/>
                        <Route exact path="/u/:id" element={<YourProfile/>}/>
                        <Route exact path="/u/:id/projects" element={<YourProjects/>}/>
                        <Route path="*" element={<ErrorNotFound/>}/>
                    </Routes>
                </ErrorBoundary>
            </div>
        </>
    )
}
