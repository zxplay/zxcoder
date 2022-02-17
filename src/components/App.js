import React, {Fragment, useState} from "react";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {TabPanel, TabView} from "primereact/tabview";
import {Nav} from "./Nav";
import {Emulator} from "./Emulator";
import {BasicEditor} from "./BasicEditor";
import {AssemblyEditor} from "./AssemblyEditor";
import {CEditor} from "./CEditor";

export default function App() {
    const [activeIndex, setActiveIndex] = useState(0);

    const zoom = 2;
    const width = zoom * 320;

    return (
        <Fragment>
            <Nav/>
            <div className="grid"
                 style={{width: "100%", padding: "4px", margin: 0}}>
                <div className="col" style={{padding: "4px"}}>
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="Sinclair Basic">
                            <BasicEditor code={'10 PRINT "Hello"\n20 GO TO 10'}/>
                        </TabPanel>
                        <TabPanel header="Assembler">
                            <AssemblyEditor code={''}/>
                        </TabPanel>
                        <TabPanel header="C">
                            <CEditor code={''}/>
                        </TabPanel>
                    </TabView>
                </div>
                <div className="col-fixed"
                     style={{width: `${width + 8}px`, padding: "4px"}}>
                    <Emulator zoom={zoom} width={width}/>
                </div>
            </div>
        </Fragment>
    )
}
