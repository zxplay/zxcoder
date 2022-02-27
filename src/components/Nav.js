import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {Menubar} from "primereact/menubar";
import {
    reset,
    showOpenFileDialog,
    viewFullScreen
} from "../redux/actions/jsspeccy";
import {
    newZXBasicProject,
    newSinclairBasicProject,
    newAssemblyProject,
    showProjectIndex,
    downloadTape
} from "../redux/actions/project";
import {getUserInfo} from "../redux/actions/identity";
import {login, logout} from "../auth";

export default function Nav() {
    const [searchInput, setSearchInput] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();
    const pathname = useSelector(state => state?.router.location.pathname);
    const selectedTabIndex = useSelector(state => state?.jsspeccy.selectedTabIndex);
    const userId = useSelector(state => state?.identity.userId);

    const start = <img alt="logo" src="img/logo.png" height="40" className="mr-2"/>;
    const end = (
        <InputText
            placeholder="Search"
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput) {
                    history.push(`/search?q=${searchInput}`);
                }
        }}/>
    );

    useEffect(() => {
        dispatch(getUserInfo());
    }, []);

    const items = [
        {
            label: 'ZX Play',
            command: () => history.push('/')
        },
        {
            label: 'Project',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'New Project',
                    icon: 'pi pi-fw pi-plus',
                    disabled: !userId,
                    items: [
                        {
                            label: 'Boriel ZX BASIC',
                            command: () => {
                                dispatch(newZXBasicProject());
                            }
                        },
                        {
                            label: 'Sinclair BASIC',
                            command: () => {
                                dispatch(newSinclairBasicProject());
                            }
                        },
                        {
                            label: 'Z80 Assembly',
                            command: () => {
                                dispatch(newAssemblyProject());
                            }
                        }
                    ]
                },
                {
                    label: 'Open Project',
                    icon: 'pi pi-fw pi-folder-open',
                    command: () => {
                        dispatch(showProjectIndex());
                    }
                },
                {
                    separator: true
                },
                {
                    label: 'Upload Tape',
                    icon: 'pi pi-fw pi-upload',
                    command: () => {
                        dispatch(showOpenFileDialog());
                        history.push('/');
                    }
                },
                {
                    label: 'Download Tape',
                    icon: 'pi pi-fw pi-download',
                    disabled: true,
                    command: () => {
                        dispatch(downloadTape());
                    }
                }
            ]
        },
        {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            items: [
                {
                    label: 'Full screen',
                    icon: 'pi pi-fw pi-window-maximize',
                    disabled: !(pathname === '/' && selectedTabIndex === 0),
                    command: () => dispatch(viewFullScreen())
                },
                {
                    separator: true
                },
                {
                    label: 'Your profile',
                    icon: 'pi pi-fw pi-user',
                    disabled: true,
                    command: () => {/* TODO */}
                }
            ]
        },
        {
            label: 'Info',
            icon: 'pi pi-fw pi-info-circle',
            items: [
                {
                    label: 'About',
                    icon: 'pi pi-fw pi-question-circle',
                    command: () => history.push('/about')
                }
            ]
        },
        {
            label: 'Reset',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                dispatch(reset());
                history.push('/');
            }
        },
        {
            label: userId ? 'Sign-out' : 'Sign-in',
            icon: userId ? 'pi pi-fw pi-sign-out' : 'pi pi-fw pi-sign-in',
            command: () => userId ? logout() : login()
        }
    ];

    return <Menubar model={items} start={start} end={end}/>;
}
