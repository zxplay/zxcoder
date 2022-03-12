import React, {Fragment, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "primereact/button";
import CodeMirror from "./CodeMirror";
import {setSelectedTabIndex} from "../redux/actions/demo";
import {setSinclairBasicCode, runSinclairBasic} from "../redux/actions/demo";
import "../lib/syntax/zmakebas";

export function DemoSinclairBasicEditor() {
    const dispatch = useDispatch();
    const cmRef = useRef(null);
    const basicCode = useSelector(state => state?.demo.sinclairBasicCode);

    const options = {
        lineWrapping: false,
        readOnly: false,
        theme: 'default',
        lineNumbers: false,
        mode: 'zmakebas'
    };

    useEffect(() => {
        const cm = cmRef.current.getCodeMirror();
        cm.setValue(basicCode || '');
        dispatch(setSinclairBasicCode(cm.getValue()))
    }, []);

    return (
        <Fragment>
            <CodeMirror
                ref={cmRef}
                options={options}
                onChange={(cm, _) => dispatch(setSinclairBasicCode(cm.getValue()))}
            />
            <Button
                label="Run"
                icon="pi pi-play"
                style={{marginTop: "8px"}}
                onClick={() => {
                    dispatch(setSelectedTabIndex(0));
                    dispatch(runSinclairBasic());
                }}
            />
        </Fragment>
    )
}
