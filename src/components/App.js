import React, {Fragment, useEffect} from "react";
import {Routes, Route} from "react-router-dom";
import {useDispatch} from "react-redux";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {Nav} from "./Nav";
import {MainCode} from "./MainCode";
import {About} from "./About";
import {exit, renderEmulator} from "../redux/actions/jsspeccy";

export default function App() {
    return (
        <Fragment>
            <RenderEmulator/>
            <Nav/>
            <div style={{maxWidth: '1024px', margin: 'auto'}}>
                <Routes>
                    <Route path="/" element={<MainCode/>} />
                    <Route path="/about" element={<About/>} />
                </Routes>
            </div>
        </Fragment>
    )
}

function RenderEmulator() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(renderEmulator(2));
        return () => {dispatch(exit())}
    }, []);

    return (
        <Fragment/>
    )
}
