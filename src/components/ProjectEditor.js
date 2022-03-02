import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import {confirmPopup} from "primereact/confirmpopup";
import CodeMirror from "./CodeMirror";
import {
    deleteProject,
    saveCodeChanges,
    setSelectedTabIndex
} from "../redux/actions/project";
import {setCode, runCode} from "../redux/actions/project";

export function ProjectEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const code = useSelector(state => state?.project.code);

    const options = {
        lineWrapping: false,
        readOnly: false,
        theme: 'default',
        lineNumbers: false,
        mode: null
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
                onClick={() => {
                    dispatch(setSelectedTabIndex(3));
                    dispatch(runCode());
                }}
            />
            <Button
                label="Save"
                icon="pi pi-save"
                className="p-button-outlined mt-2 mr-2"
                onClick={() => {
                    dispatch(saveCodeChanges());
                }}
            />
            <Button
                label="Delete"
                icon="pi pi-times"
                className="p-button-outlined p-button-danger mt-2"
                onClick={(e) => {
                    deleteConfirm(e);
                }}
            />
        </Fragment>
    )
}
