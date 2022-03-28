import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import {confirmPopup} from "primereact/confirmpopup";
import CodeMirror from "./CodeMirror";
import "codemirror/mode/z80/z80";
import {
    deleteProject,
    saveCodeChanges,
} from "../redux/actions/project";
import {setCode, runCode} from "../redux/actions/project";
import "../lib/syntax/pasmo";
import "../lib/syntax/zmakebas";
import "../lib/syntax/z88dk-c";
import "../lib/syntax/zxbasic";

export function ProjectEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const lang = useSelector(state => state?.project.lang);
    const code = useSelector(state => state?.project.code);
    const savedCode = useSelector(state => state?.project.savedCode);

    let mode, lineNumbers;
    switch (lang) {
        case 'asm':
            mode = 'text/x-pasmo';
            lineNumbers = true;
            break;
        case 'basic':
            mode = 'text/x-zmakebas';
            lineNumbers = false;
            break;
        case 'c':
            mode = 'text/x-z88dk-csrc';
            lineNumbers = true;
            break;
        case 'zxbasic':
            mode = 'text/x-zxbasic';
            lineNumbers = false;
            break;
        default:
            throw 'unexpected case';
    }

    const options = {
        lineWrapping: false,
        readOnly: false,
        theme: 'default',
        lineNumbers,
        mode
    };

    useEffect(() => {
        const cm = cmRef.current.getCodeMirror();
        cm.setValue(code || '');
        dispatch(setCode(cm.getValue()))
    }, []);

    const deleteConfirm = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to permanently remove this project?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => dispatch(deleteProject()),
            reject: () => {}
        });
    }

    return (
        <Fragment>
            <CodeMirror
                ref={cmRef}
                options={options}
                onChange={(cm, _) => dispatch(setCode(cm.getValue()))}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                className="mt-2 mr-2"
                onClick={() => dispatch(runCode())}
            />
            <Button
                label="Save"
                icon="pi pi-save"
                className="p-button-outlined mt-2 mr-2"
                disabled={code === savedCode}
                onClick={() => dispatch(saveCodeChanges())}
            />
            <Button
                label="Delete"
                icon="pi pi-times"
                className="p-button-outlined p-button-danger mt-2"
                onClick={(e) => deleteConfirm(e)}
            />
        </Fragment>
    )
}
