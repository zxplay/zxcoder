import React from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {Emulator} from "./Emulator";
import {BasicEditor} from "./BasicEditor";

export default function App() {
    const zoom = 2;
    const width = zoom * 320;
    return (
        <div className="grid" style={{width: "100%", padding: "4px", margin: 0}}>
            <div className="col" style={{padding: "4px"}}>
                <BasicEditor/>
            </div>
            <div className="col-fixed" style={{width: `${width + 8}px`, padding: "4px"}}>
                <Emulator zoom={zoom} width={width}/>
            </div>
        </div>
    )
}
