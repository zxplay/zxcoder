import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {useDispatch} from "react-redux";
import {runBasic} from "../redux/actions/jsspeccy";

export function BasicEditor(props) {
    const dispatch = useDispatch();

    const options = {
        lineWrapping: true,
        readOnly: false,
        // mode: 'formula',
        theme: 'default',
        scrollbarStyle: 'null',
        lineNumbers: false,
        matchBrackets: true,
        extraKeys: {
            // 'Enter': () => props.onEnter && props.onEnter(this.text),
            // 'Shift-Enter': () => props.onShiftEnter && props.onShiftEnter(this.text),
            // 'Esc': () => props.onEscape && props.onEscape(),
            // 'Tab': () => props.onTab && props.onTab(this.text),
            // 'Shift-Tab': () => props.onShiftTab && props.onShiftTab(this.text),
        }
    };

    return (
        <Fragment>
            <CodeMirror
                options={options}
                value={props.code || ''}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                style={{marginTop: "8px"}}
                onClick={() => dispatch(runBasic('10 PRINT "Hello"'))}
            />
        </Fragment>
    )
}

BasicEditor.propTypes = {
    code: PropTypes.string
}
