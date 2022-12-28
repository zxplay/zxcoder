import React, {Fragment} from "react";
import {useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
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
        </Fragment>
    )
}
