import React from "react";
import {InputText} from "primereact/inputtext";
import {Menubar} from "primereact/menubar";

export function Nav() {
    const start = <img alt="logo" src="/img/logo.png" height="40" className="mr-2"/>;
    const end = <InputText placeholder="Search" type="text"/>;
    return <Menubar model={items} start={start} end={end}/>;
}

const items = [
    {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
            /*
                        {
                            label: 'New',
                            icon: 'pi pi-fw pi-plus'
                        },
            */
            {
                label: 'Open',
                icon: 'pi pi-fw pi-folder-open'
            }
        ]
    },
    {
        label: 'Reset',
        icon: 'pi pi-fw pi-power-off'
    }
];
