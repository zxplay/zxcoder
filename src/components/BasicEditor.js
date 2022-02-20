import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {setSelectedTabIndex} from "../redux/actions/jsspeccy";
import {setBasicCode, runBasic} from "../redux/actions/basic";

export function BasicEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const basicCode = useSelector(state => state?.basic.basicCode);

    const options = {
        lineWrapping: false,
        readOnly: false,
        theme: 'default',
        lineNumbers: true,
        matchBrackets: true,
        mode: null
    };

    useEffect(() => {
        const cm = cmRef.current.getCodeMirror();
        cm.setValue(basicCode || '');
        dispatch(setBasicCode(cm.getValue()))
    }, []);

    return (
        <Fragment>
            <CodeMirror
                ref={cmRef}
                options={options}
                onChange={(cm, _) => dispatch(setBasicCode(cm.getValue()))}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                style={{marginTop: "8px"}}
                onClick={() => {
                    dispatch(setSelectedTabIndex(0));
                    dispatch(runBasic());
                }}
            />
        </Fragment>
    )
}
