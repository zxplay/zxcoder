import React from "react";
import {useDispatch} from "react-redux";
import {InputText} from "primereact/inputtext";
import {Menubar} from "primereact/menubar";
import {
    reset,
    showGameBrowser,
    showOpenFileDialog
} from "../redux/actions/jsspeccy";

export function Nav() {
    const dispatch = useDispatch();

    const start = <img alt="logo" src="img/logo.png" height="40" className="mr-2"/>;
    const end = <InputText placeholder="Search" type="text" onClick={() => {
        dispatch(showGameBrowser())
    }}/>;

    const items = [
        {
            label: 'File',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Open',
                    icon: 'pi pi-fw pi-folder-open',
                    command: () => dispatch(showOpenFileDialog())
                }
            ]
        },
        {
            label: 'Reset',
            icon: 'pi pi-fw pi-power-off',
            command: () => dispatch(reset())
        }
    ];

    return <Menubar model={items} start={start} end={end}/>;
}
