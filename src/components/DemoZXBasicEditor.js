import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {setSelectedTabIndex} from "../redux/actions/demo";
import {setZXBasicCode, runZXBasic} from "../redux/actions/demo";
import "../lib/syntax/zxbasic";

export function DemoZXBasicEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const code = useSelector(state => state?.demo.zxBasicCode);

    const options = {
        mode: 'text/x-zxbasic',
        theme: 'mbo',
        readOnly: false,
        lineWrapping: false,
        lineNumbers: true,
        matchBrackets: true,
        tabSize: 4,
        indentAuto: true
    };

    useEffect(() => {
        const cm = cmRef.current.getCodeMirror();
        cm.setValue(code || '');
        dispatch(setZXBasicCode(cm.getValue()))
    }, []);

    return (
        <Fragment>
            <CodeMirror
                ref={cmRef}
                options={options}
                onChange={(cm, _) => dispatch(setZXBasicCode(cm.getValue()))}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                style={{marginTop: "8px"}}
                onClick={() => {
                    dispatch(setSelectedTabIndex(0));
                    dispatch(runZXBasic());
                }}
            />
        </Fragment>
    )
}
