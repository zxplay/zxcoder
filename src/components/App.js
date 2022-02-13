import React, {Fragment} from "react";
import {Emulator} from "./Emulator";
import {Keyboard} from "./Keyboard";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function App() {
    const zoom = 2;
    const width = zoom * 320;
    return (
        <Fragment>
            <Emulator zoom={zoom}/>
            <Keyboard width={width}/>
        </Fragment>
    )
}
