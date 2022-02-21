import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {Menubar} from "primereact/menubar";
import {
    reset,
    showGameBrowser,
    showOpenFileDialog,
    viewFullScreen
} from "../redux/actions/jsspeccy";
import {getUserInfo} from "../redux/actions/identity";
import {login, logout} from "../auth";

export function Nav() {
    const dispatch = useDispatch();
    const history = useHistory();
    const pathname = useSelector(state => state?.router.location.pathname);
    const selectedTabIndex = useSelector(state => state?.jsspeccy.selectedTabIndex);
    const userId = useSelector(state => state?.identity.userId);

    const start = <img alt="logo" src="img/logo.png" height="40" className="mr-2"/>;
    const end = (
        <InputText placeholder="Search" type="text" onClick={() => {
            dispatch(showGameBrowser())
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
                    label: 'Open Tape File',
                    icon: 'pi pi-fw pi-folder-open',
                    command: () => dispatch(showOpenFileDialog())
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
