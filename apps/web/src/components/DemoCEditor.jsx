import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {setSelectedTabIndex} from "../redux/demo/actions";
import {setCCode, runC} from "../redux/demo/actions";
import "../lib/syntax/z88dk-c";

export function DemoCEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const code = useSelector(state => state?.demo.cCode);

    const options = {
        mode: 'text/x-z88dk-csrc',
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
        dispatch(setCCode(cm.getValue()))
    }, []);

    return (
        <Fragment>
            <CodeMirror
                ref={cmRef}
                options={options}
                onChange={(cm, _) => dispatch(setCCode(cm.getValue()))}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                style={{marginTop: "8px"}}
                onClick={() => {
                    dispatch(setSelectedTabIndex(0));
                    dispatch(runC());
                }}
            />
        </Fragment>
    )
}
