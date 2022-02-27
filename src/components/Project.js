import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {TabPanel, TabView} from "primereact/tabview";
import {DemoSinclairBasicEditor} from "./DemoSinclairBasicEditor";
import {DemoAssemblyEditor} from "./DemoAssemblyEditor";
import {DemoZXBasicEditor} from "./DemoZXBasicEditor";
import {Emulator} from "./Emulator";
import {setSelectedTabIndex} from "../redux/actions/project";

export default function Project() {
    const dispatch = useDispatch();
    const activeIndex = useSelector(state => state?.project.selectedTabIndex);
    const projectType = useSelector(state => state?.project.type);
    const zoom = 2;
    const width = zoom * 320;

    return (
        <div className="grid"
             style={{width: "100%", padding: 0, margin: 0}}>
            <div className="col" style={{padding: 0}}>

            </div>
            <div className="col-fixed"
                 style={{width: `${width}px`, padding: '4px 0 0 0'}}>
                <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => dispatch(setSelectedTabIndex(e.index))}>
                    {projectType === 'zxbasic' &&
                        <TabPanel header="Boriel ZX BASIC">
                            <DemoZXBasicEditor/>
                        </TabPanel>
                    }
                    {projectType === 'basic' &&
                        <TabPanel header="Sinclair BASIC">
                            <DemoSinclairBasicEditor/>
                        </TabPanel>
                    }
                    {projectType === 'asm' &&
                        <TabPanel header="Z80 Assembler">
                            <DemoAssemblyEditor/>
                        </TabPanel>
                    }
                    <TabPanel header="Emulator">
                        <Emulator zoom={zoom} width={width}/>
                    </TabPanel>
                </TabView>
            </div>
            <div className="col" style={{padding: 0}}>

            </div>
        </div>
    )
}
