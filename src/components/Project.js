import React, {Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {TabPanel, TabView} from "primereact/tabview";
import {Emulator} from "./Emulator";
import {loadProject, setSelectedTabIndex} from "../redux/actions/project";
import {ProjectEditor} from "./ProjectEditor";

export default function Project(props) {
    const dispatch = useDispatch();

    const userId = useSelector(state => state?.identity.userId);

    useEffect(() => {
        dispatch(loadProject(props.id));
        return () => {}
    }, [props.id, userId]);

    const tab = useSelector(state => state?.project.selectedTabIndex);
    const type = useSelector(state => state?.project.type);
    let title = useSelector(state => state?.project.title);
    let ready = useSelector(state => state?.project.ready);

    if (!props.id || !ready) return <Fragment/>;

    if (title) title = `Project: ${title}`;

    const zoom = 2;
    const width = zoom * 320;

    let editorTitle;
    switch (type) {
        case 'asm':
            editorTitle = 'Z80 Assembler';
            break;
        case 'basic':
            editorTitle = 'Sinclair BASIC';
            break;
        case 'zxbasic':
            editorTitle = 'Boriel ZX BASIC';
            break;
        default:
            throw 'unexpected case';
    }

    return (
        <div className="grid" style={{width: "100%", padding: 0, margin: 0}}>
            <div className="col m-4">
                <h3>{title}</h3>
            </div>
            <div className="col-fixed" style={{width: `${width}px`, padding: '6px 0 0 0'}}>
                <TabView
                    activeIndex={tab}
                    onTabChange={(e) => dispatch(setSelectedTabIndex(e.index))}>
                    <TabPanel header={editorTitle}>
                        <ProjectEditor id={props.id}/>
                    </TabPanel>
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

Project.propTypes = {
    id: PropTypes.string.isRequired,
}
