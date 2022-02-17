import React, {Fragment, useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {useDispatch} from "react-redux";
import {runBasic} from "../redux/actions/jsspeccy";

export function BasicEditor(props) {
    const [code, setCode] = useState(props.code || '');
    const dispatch = useDispatch();
    const cmRef = useRef(null);

    const options = {
        readOnly: false,
        theme: 'default',
        matchBrackets: true
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
                onClick={() => dispatch(runBasic(code))}
            />
        </Fragment>
    )
}

BasicEditor.propTypes = {
    code: PropTypes.string
}
