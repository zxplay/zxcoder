import React from "react";
import {useParams} from "react-router-dom";
import {Card} from "primereact/card";
import ProjectList from "../ProjectList";
import RequireSubscriber from "../common/RequireSubscriber";

export default function YourProjects() {
    const {id} = useParams();

    return (
        <Card className="m-2">
            <h1>Your Projects</h1>
            <RequireSubscriber>
                <ProjectList/>
            </RequireSubscriber>
        </Card>
    )
}
