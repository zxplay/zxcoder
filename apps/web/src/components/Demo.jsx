import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import queryString from "query-string";
import {TabPanel, TabView} from "primereact/tabview";
import {DemoSinclairBasicEditor} from "./DemoSinclairBasicEditor";
import {DemoAssemblyEditor} from "./DemoAssemblyEditor";
import {DemoZXBasicEditor} from "./DemoZXBasicEditor";
import {DemoCEditor} from "./DemoCEditor";
import {Emulator} from "./Emulator";
import {setSelectedTabIndex} from "../redux/demo/actions";
import {reset as resetProject} from "../redux/project/actions";
import {reset} from "../redux/jsspeccy/actions";

export default function Demo() {
    const dispatch = useDispatch();

    const activeIndex = useSelector(state => state?.demo.selectedTabIndex);

    const zoom = 2;
    const width = zoom * 320;

    // Hide tabs when loading external tape files.
    const search = useSelector(state => state?.router.location.search);
    const parsed = queryString.parse(search);
    const externalLoad = typeof parsed.u !== 'undefined';

    useEffect(() => {
        dispatch(resetProject());
        return () => {
            dispatch(reset());
        }
    }, []);

    return (
        <div className="grid" style={{width: "100%", padding: 0, margin: 0}}>
            <div className="col" style={{padding: 0}}>

            </div>
            <div className="col-fixed p-0 pt-1" style={{width: `${width}px`}}>
                {externalLoad &&
                    <Emulator zoom={zoom} width={width}/>
                }
                {!externalLoad &&
                    <TabView
                        activeIndex={activeIndex}
                        onTabChange={(e) => dispatch(setSelectedTabIndex(e.index))}>
                        <TabPanel header="Emulator">
                            <Emulator zoom={zoom} width={width}/>
                        </TabPanel>
                        <TabPanel header="Z80 Assembly">
                            <DemoAssemblyEditor/>
                        </TabPanel>
                        <TabPanel header="Sinclair BASIC">
                            <DemoSinclairBasicEditor/>
                        </TabPanel>
{/*
                        <TabPanel header="Boriel ZX BASIC">
                            <DemoZXBasicEditor/>
                        </TabPanel>
                        <TabPanel header="C">
                            <DemoCEditor/>
                        </TabPanel>
*/}
                    </TabView>
                }
            </div>
            <div className="col" style={{padding: 0}}>

            </div>
        </div>
    )
}
