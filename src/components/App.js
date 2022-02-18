import React, {Fragment} from "react";
import {Routes, Route} from "react-router-dom";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {Nav} from "./Nav";
import {MainCode} from "./MainCode";
import {About} from "./About";

export default function App() {
    return (
        <Fragment>
            <Nav/>
            <Routes>
                <Route path="/" element={<MainCode/>} />
                <Route path="/about" element={<About/>} />
            </Routes>
        </Fragment>
    )
}
