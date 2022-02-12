import React, {useEffect} from "react";
import {JSSpeccy} from "../lib/emulator/jsspeccy";

export function Emulator() {
    useEffect(() => {
        renderEmulator();
    }, []);

    return (
        <div id="jsspeccy"/>
    )
}

function renderEmulator() {
    const emuParams = {
        zoom: 3,
        sandbox: true,
        autoLoadTapes: true,
    };

    let doFilter = false;

    const url = new URL(window.location.href);
    for (const [key, value] of url.searchParams) {
        if (key === 'm') {
            if (value === '48' || value === '128' || value === '5') {
                emuParams.machine = value;
            }
        } else if (key === 'u') {
            emuParams.openUrl = value;
        } else if (key === 'f') {
            if (value && value !== '0') {
                doFilter = true;
            }
        }
    }

    JSSpeccy(document.getElementById('jsspeccy'), emuParams);

    if (doFilter) {
        document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
    }
}
