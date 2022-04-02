import React from "react";
import {Card} from "primereact/card";

export default function NotFound() {
    return (
        <Card className="m-2">
            <h1>Not Found</h1>
            <p>
                Requested page location not found.
            </p>
        </Card>
    )
}
