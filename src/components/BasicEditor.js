import React from "react";
import CodeMirror from "./CodeMirror";

export function BasicEditor() {
    const options = {
        lineWrapping: true,
        readOnly: false,
        // mode: 'formula',
        theme: 'default',
        scrollbarStyle: 'null',
        lineNumbers: false,
        matchBrackets: true,
        extraKeys: {
            // 'Enter': () => props.onEnter && props.onEnter(this.text),
            // 'Shift-Enter': () => props.onShiftEnter && props.onShiftEnter(this.text),
            // 'Esc': () => props.onEscape && props.onEscape(),
            // 'Tab': () => props.onTab && props.onTab(this.text),
            // 'Shift-Tab': () => props.onShiftTab && props.onShiftTab(this.text),
        }
    };

    return (
        <CodeMirror
            options={options}
        />
    )
}
