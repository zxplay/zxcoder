import React, {Fragment, useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import "codemirror/mode/z80/z80";
import {runAssembly, setSelectedTabIndex} from "../redux/actions/jsspeccy";

export function AssemblyEditor(props) {
    const [code, setCode] = useState(props.code || '');
    const dispatch = useDispatch();
    const cmRef = useRef(null);

    const options = {
        lineWrapping: true,
        readOnly: false,
        theme: 'default',
        lineNumbers: true,
        matchBrackets: true,
        mode: 'z80'
    };

    useEffect(() => {
        const cm = cmRef.current.getCodeMirror();
        cm.setValue(props.code || '');
    }, []);

    return (
        <Fragment>
            <CodeMirror
                ref={cmRef}
                options={options}
                onChange={(cm, _) => setCode(cm.getValue())}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                style={{marginTop: "8px"}}
                onClick={() => {
                    dispatch(setSelectedTabIndex(0));
                    dispatch(runAssembly(code));
                }}
            />
        </Fragment>
    )
}

AssemblyEditor.propTypes = {
    code: PropTypes.string
}
