import React, {Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import {JSSpeccy} from "../lib/emulator/JSSpeccy";
import {Keyboard} from "./Keyboard";

export function Emulator(props) {
    const zoom = props.zoom || 3;
    const width = props.width || zoom * 320;

    useEffect(() => {
        const jsspeccy = renderEmulator(zoom);

        document.addEventListener('click', e => {
            const emuElem = document.querySelector('#jsspeccy');
            const keybElem = document.querySelector('#guiparent');
            if (!emuElem.contains(e.target) && !keybElem.contains(e.target)) {
                jsspeccy.pause();
            }
        });

        return () => {
            jsspeccy.exit();
        }
    }, []);

    return (
        <Fragment>
            <div id="jsspeccy" style={{
                width: `${width}px`,
                margin: "auto",
                backgroundColor: "#FFF"
            }}/>
            <Keyboard width={width}/>
        </Fragment>
    )
}

Emulator.propTypes = {
    zoom: PropTypes.number,
    width: PropTypes.number
}

function renderEmulator(zoom) {
    const emuParams = {
        zoom,
        sandbox: false,
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

    const jsspeccy = JSSpeccy(document.getElementById('jsspeccy'), emuParams);
    // jsspeccy.hideUI();

    if (doFilter) {
        document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
    }

    return jsspeccy;
}
