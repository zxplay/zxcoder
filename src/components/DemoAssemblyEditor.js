import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {setSelectedTabIndex} from "../redux/actions/demo";
import {setAssemblyCode, runAssembly} from "../redux/actions/demo";
import "../lib/syntax/pasmo";

export function DemoAssemblyEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const asmCode = useSelector(state => state?.demo.asmCode);

    const options = {
        lineWrapping: false,
        readOnly: false,
        theme: 'default',
        lineNumbers: true,
        mode: 'text/x-pasmo'
    };

    useEffect(() => {
        const cm = cmRef.current.getCodeMirror();
        cm.setValue(asmCode || '');
        dispatch(setAssemblyCode(cm.getValue()))
    }, []);

    return (
        <Fragment>
            <CodeMirror
                ref={cmRef}
                options={options}
                onChange={(cm, _) => dispatch(setAssemblyCode(cm.getValue()))}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                style={{marginTop: "8px"}}
                onClick={() => {
                    dispatch(setSelectedTabIndex(0));
                    dispatch(runAssembly());
                }}
            />
        </Fragment>
    )
}
