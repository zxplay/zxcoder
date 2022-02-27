import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {TabPanel, TabView} from "primereact/tabview";
import {SinclairBasicEditor} from "./SinclairBasicEditor";
import {AssemblyEditor} from "./AssemblyEditor";
import {ZXBasicEditor} from "./ZXBasicEditor";
import {Emulator} from "./Emulator";
import {setSelectedTabIndex} from "../redux/actions/jsspeccy";

export default function MainCode() {
    const dispatch = useDispatch();
    const activeIndex = useSelector(state => state?.jsspeccy.selectedTabIndex);
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
                    <TabPanel header="Emulator">
                        <Emulator zoom={zoom} width={width}/>
                    </TabPanel>
                    <TabPanel header="ZX Basic">
                        <ZXBasicEditor/>
                    </TabPanel>
                    <TabPanel header="Sinclair Basic">
                        <SinclairBasicEditor/>
                    </TabPanel>
                    <TabPanel header="Z80 Assembler">
                        <AssemblyEditor/>
                    </TabPanel>
                </TabView>
            </div>
            <div className="col" style={{padding: 0}}>

            </div>
        </div>
    )
}
