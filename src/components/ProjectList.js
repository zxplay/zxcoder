import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {
    subscribeToProjectList,
    unsubscribeFromProjectList
} from "../redux/actions/projectList";

export default function ProjectList() {
    const dispatch = useDispatch();

    const rows = useSelector(state => state?.projectList.projectList);

    useEffect(() => {
        dispatch(subscribeToProjectList());
        return () => {
            dispatch(unsubscribeFromProjectList());
        }
    }, [dispatch]);

    function linkName(data) {
        return (
            <Link to={`/projects/${data['project_id']}`}>
                {data['title']}
            </Link>
        )
    }

    function lang(data) {
        switch (data.lang) {
            case 'zxbasic':
                return 'Boriel ZX BASIC';
            case 'basic':
                return 'Sinclair BASIC';
            case 'asm':
                return 'Z80 Assembly';
        }
    }

    const now = new Date();

    function created(data) {
        const date = new Date(data['created_at']);
        return formatDistance(date, now, {addSuffix: true});
    }

    function updated(data) {
        const date = new Date(data['updated_at']);
        return formatDistance(date, now, {addSuffix: true});
    }

    return (
        <DataTable value={rows}>
            <Column
                field="title"
                header="Project Title"
                body={linkName}
                style={{width: '34%'}}
            />
            <Column
                field="lang"
                header="Language"
                body={lang}
                style={{width: '22%'}}
            />
            <Column
                field="created_at"
                header="Created"
                body={created}
                style={{width: '22%'}}
            />
            <Column
                field="updated_at"
                header="Updated"
                body={updated}
                style={{width: '22%'}}
            />
        </DataTable>
    )
}
