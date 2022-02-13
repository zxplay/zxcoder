import React, {Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {Keyboard} from "./Keyboard";
import {exit, renderEmulator} from "../redux/actions/jsspeccy";

export function Emulator(props) {
    const dispatch = useDispatch();

    const zoom = props.zoom || 3;
    const width = props.width || zoom * 320;

    useEffect(() => {
        const target = document.getElementById('jsspeccy');
        dispatch(renderEmulator(target, zoom));
        return () => {
            dispatch(exit());
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
