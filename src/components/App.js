import React, {Fragment} from "react";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {Emulator} from "./Emulator";
import {BasicEditor} from "./BasicEditor";
import {Menubar} from "primereact/menubar";
import {InputText} from "primereact/inputtext";

export default function App() {
    const zoom = 2;
    const width = zoom * 320;

    const start = (
        <img alt="logo"
             src="/img/logo.png"
             height="40"
             className="mr-2"
        />
    )

    const end = <InputText placeholder="Search" type="text"/>;

    return (
        <Fragment>
            <Menubar model={items} start={start} end={end}/>
            <div className="grid"
                 style={{width: "100%", padding: "4px", margin: 0}}>
                <div className="col" style={{padding: "4px"}}>
                    <BasicEditor/>
                </div>
                <div className="col-fixed"
                     style={{width: `${width + 8}px`, padding: "4px"}}>
                    <Emulator zoom={zoom} width={width}/>
                </div>
                <div className="col" style={{padding: "4px"}}>

                </div>
            </div>
        </Fragment>
    )
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
