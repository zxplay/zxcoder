import React from "react";
import {Card} from "primereact/card";
import ProjectList from "../ProjectList";
import RequireSubscriber from "../common/RequireSubscriber";

export default function YourProjects() {
    return (
        <Card className="m-2">
            <h1>Your Projects</h1>
            <RequireSubscriber>
                <ProjectList/>
            </RequireSubscriber>
        </Card>
    )
}
