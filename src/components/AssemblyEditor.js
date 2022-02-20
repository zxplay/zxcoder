import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {setSelectedTabIndex} from "../redux/actions/jsspeccy";
import {setAssemblyCode, runAssembly} from "../redux/actions/asm";
import "codemirror/mode/z80/z80";

export function AssemblyEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const asmCode = useSelector(state => state?.asm.asmCode);

    const options = {
        lineWrapping: false,
        readOnly: false,
        theme: 'default',
        lineNumbers: true,
        matchBrackets: true,
        mode: 'z80'
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
