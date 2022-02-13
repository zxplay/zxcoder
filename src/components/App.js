import React from "react";
import {Emulator} from "./Emulator";
import {Keyboard} from "./Keyboard";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export default function App() {
    const zoom = 2;
    const width = zoom * 320;
    return (
        <div className="grid" style={{width: "100%", padding: "8px", margin: 0}}>
            <div className="col" style={{padding: 0}}>
                <textarea></textarea>
            </div>
            <div className="col-fixed" style={{width: `${width}px`, padding: 0}}>
                <Emulator zoom={zoom}/>
                <Keyboard width={width}/>
            </div>
        </div>
    )
}
