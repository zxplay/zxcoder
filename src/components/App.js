import React, {Fragment} from "react";
import {Emulator} from "./Emulator";
import {Keyboard} from "./Keyboard";

export default function App() {
    return (
        <Fragment>
            <Emulator/>
            <Keyboard/>
        </Fragment>
    )
}
