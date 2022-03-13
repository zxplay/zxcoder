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
        lineWrapping: false,
        readOnly: false,
        theme: 'default',
        lineNumbers: false,
        mode: 'text/x-zxbasic'
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
