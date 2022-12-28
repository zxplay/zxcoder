import React, {Fragment, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {TabPanel, TabView} from "primereact/tabview";
import {Emulator} from "../Emulator";
import {loadProject, setSelectedTabIndex} from "../../redux/actions/project";
import {ProjectEditor} from "../ProjectEditor";

export default function Project() {
    const {id} = useParams();

    const dispatch = useDispatch();

    const userId = useSelector(state => state?.identity.userId);
    const tab = useSelector(state => state?.project.selectedTabIndex);
    const lang = useSelector(state => state?.project.lang);
    let title = useSelector(state => state?.project.title);

    useEffect(() => {
        dispatch(loadProject(id));
        return () => {}
    }, [id, userId]);

    if (!id || !lang) {
        return <Fragment/>;
    }

    if (title) {
        title = `Project: ${title}`;
    }

    const zoom = 2;
    const width = zoom * 320;

    let editorTitle;
    switch (lang) {
        case 'asm':
            editorTitle = 'Z80 (Pasmo)';
            break;
        case 'basic':
            editorTitle = 'Sinclair BASIC';
            break;
        case 'c':
            editorTitle = 'z88dk scc';
            break;
        case 'sdcc':
            editorTitle = 'SDCC';
            break;
        case 'zmac':
            editorTitle = 'Z80 (zmac)';
            break;
        case 'zxbasic':
            editorTitle = 'Boriel ZX BASIC';
            break;
        default:
            throw `unexpected case: ${lang}`;
    }

    return (
        <div className="mx-2 my-1">
            <div className="grid" style={{width: "100%", padding: 0, margin: 0}}>
                <div className="col p-0 mr-2" style={{maxWidth: `calc(100vw - ${width + 41}px`}}>
                    <TabView
                        activeIndex={tab}
                        onTabChange={(e) => dispatch(setSelectedTabIndex(e.index))}>
                        <TabPanel header={editorTitle}>
                            <ProjectEditor id={id}/>
                        </TabPanel>
                    </TabView>
                </div>
                <div className="col-fixed p-0 pt-1" style={{width: `${width}px`}}>
                    <div style={{height: '53px'}} className="pt-3 pl-1">
                        <h3>{title}</h3>
                    </div>
                    <Emulator zoom={zoom} width={width}/>
                </div>
            </div>
        </div>
    )
}
