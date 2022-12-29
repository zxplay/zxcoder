import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {Menubar} from "primereact/menubar";
import {
    pause,
    showOpenFileDialog,
    viewFullScreen
} from "../redux/jsspeccy/jsspeccy";
import {downloadProjectTap} from "../redux/eightbit/eightbit";
import {getUserInfo} from "../redux/identity/identity";
import {login, logout} from "../auth";
import {resetEmulator} from "../redux/app/app";

export default function Nav() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState([]);

    const pathname = useSelector(state => state?.router.location.pathname);
    const selectedDemoTab = useSelector(state => state?.demo.selectedTabIndex);
    const userId = useSelector(state => state?.identity.userId);
    const lang = useSelector(state => state?.project.lang);

    const emuVisible = (pathname === '/' && selectedDemoTab === 0) || pathname.startsWith('/projects/');

    const start = <img alt="logo" src="/logo.png" height="40" className="mr-2"/>;
    const end = (
        <InputText
            placeholder="Search"
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput) {
                    navigate(`/search?q=${searchInput}`);
                }
        }}/>
    );

    useEffect(() => {
        dispatch(getUserInfo());
    }, []);

    const items = [
        {
            label: 'ZX Play',
            command: () => {
                navigate('/');
            }
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
                            label: 'Z80 Assembly',
                            items: [
                                {
                                    label: 'Pasmo',
                                    command: () => {
                                        dispatch(pause());
                                        navigate('/new/asm');
                                    }
                                },
                                {
                                    label: 'zmac',
                                    command: () => {
                                        dispatch(pause());
                                        navigate('/new/zmac');
                                    }
                                }
                            ]
                        },
                        {
                            label: 'BASIC',
                            items: [
                                // {
                                //     label: 'Boriel ZX',
                                //     command: () => {
                                //         dispatch(pause());
                                //         navigate('/new/zxbasic');
                                //     }
                                // },
                                {
                                    label: 'Sinclair (zmakebas)',
                                    command: () => {
                                        dispatch(pause());
                                        navigate('/new/basic');
                                    }
                                }
                            ]
                        },
                        {
                            label: 'C',
                            items: [
                                // {
                                //     label: 'z88dk zcc',
                                //     command: () => {
                                //         dispatch(pause());
                                //         navigate('/new/c');
                                //     }
                                // },
                                {
                                    label: 'SDCC',
                                    command: () => {
                                        dispatch(pause());
                                        navigate('/new/sdcc');
                                    }
                                }
                            ]
                        },
                    ]
                },
                {
                    label: 'Open Project',
                    icon: 'pi pi-fw pi-folder-open',
                    disabled: !userId,
                    command: () => {
                        navigate(`/u/${userId}/projects`);
                    }
                },
                {
                    separator: true
                },
                {
                    label: 'Upload TAP',
                    icon: 'pi pi-fw pi-upload',
                    command: () => {
                        dispatch(showOpenFileDialog());
                        navigate('/');
                    }
                },
                {
                    label: 'Download TAP',
                    icon: 'pi pi-fw pi-download',
                    disabled: typeof lang === 'undefined',
                    command: () => {
                        dispatch(downloadProjectTap());
                    }
                }
            ]
        },
        {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            items: [
                {
                    label: 'Full Screen',
                    icon: 'pi pi-fw pi-window-maximize',
                    disabled: !emuVisible,
                    command: () => {
                        dispatch(viewFullScreen());
                    }
                },
                {
                    separator: true
                },
                {
                    label: 'Your Profile',
                    icon: 'pi pi-fw pi-user',
                    disabled: !userId,
                    command: () => {
                        navigate(`/u/${userId}`);
                    }
                },
                {
                    label: 'Your Projects',
                    icon: 'pi pi-fw pi-folder',
                    disabled: !userId,
                    command: () => {
                        navigate(`/u/${userId}/projects`);
                    }
                }
            ]
        },
        {
            label: 'Info',
            icon: 'pi pi-fw pi-info-circle',
            items: [
                {
                    label: 'About This Site',
                    icon: 'pi pi-fw pi-question-circle',
                    command: () => {
                        navigate('/about');
                    }
                },
                {
                    label: 'Linking To ZX Play',
                    icon: 'pi pi-fw pi-link',
                    command: () => {
                        navigate('/info/linking');
                    }
                },
                {
                    label: 'Privacy Policy',
                    icon: 'pi pi-fw pi-eye',
                    command: () => {
                        navigate('/legal/privacy-policy');
                    }
                },
                {
                    label: 'Terms of Use',
                    icon: 'pi pi-fw pi-info-circle',
                    command: () => {
                        navigate('/legal/terms-of-use');
                    }
                }
            ]
        },
        {
            label: 'Reset',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                dispatch(resetEmulator());
            }
        },
        {
            label: userId ? 'Sign-out' : 'Sign-in',
            icon: userId ? 'pi pi-fw pi-sign-out' : 'pi pi-fw pi-sign-in',
            command: () => {
                userId ? logout() : login()
            }
        }
    ];

    return (
        <div className="px-2 pt-2">
            <Menubar
                model={items}
                start={start}
                end={end}
                style={{
                    borderRadius: '5px',
                    borderColor: '#1E1E1E'
                }}
            />
        </div>
    );
}
