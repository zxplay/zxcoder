import React, {Fragment, useEffect} from "react";
import {useDispatch} from "react-redux";
import {exit, renderEmulator} from "../redux/actions/jsspeccy";

export default function RenderEmulator() {
    const dispatch = useDispatch();

    // NOTE: Using simple component function so emulator is rendered early.

    useEffect(() => {
        dispatch(renderEmulator(2));
        return () => {dispatch(exit())}
    }, []);

    return (
        <Fragment/>
    )
}
