import React from "react";
import {useParams} from "react-router-dom";
import {Card} from "primereact/card";
import ProjectList from "./ProjectList";
import RequireSubscriber from "./RequireSubscriber";
import {Titled} from "react-titled";
import {sep} from "../constants";

export default function YourProjectsPage() {
    const {id} = useParams();

    return (
        <Titled title={(s) => `Your Projects ${sep} ${s}`}>
            <Card className="m-2">
                <h1>Your Projects</h1>
                <RequireSubscriber>
                    <ProjectList/>
                </RequireSubscriber>
            </Card>
        </Titled>
    )
}
